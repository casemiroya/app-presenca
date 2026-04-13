const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Carregar usuários
let usuariosData = {};
try {
  const usuariosFile = fs.readFileSync('usuarios.json', 'utf8');
  usuariosData = JSON.parse(usuariosFile);
} catch (error) {
  console.error('Erro ao carregar usuarios.json:', error);
}

// Pasta raiz dos diários
// Se estiver em produção (Replit), usa './diarios'
// Se local, usa o caminho completo
const PASTA_DIARIOS = process.env.PASTA_DIARIOS ||
  (process.env.NODE_ENV === 'production'
    ? './diarios'
    : 'D:\\1. PROJETOS\\ESCOLA\\2026\\DIÁRIOS');

// Função para listar todos os diários disponíveis
function listarDiarios() {
  const diarios = [];

  try {
    const pastasDisciplinas = fs.readdirSync(PASTA_DIARIOS, { withFileTypes: true });

    pastasDisciplinas.forEach(pasta => {
      if (!pasta.isDirectory()) return;

      const caminhoDisc = path.join(PASTA_DIARIOS, pasta.name);
      const pastasInternasPath = path.join(caminhoDisc);

      // Procura pastas internas (como "Matemática", "Português")
      const pastasInternas = fs.readdirSync(pastasInternasPath, { withFileTypes: true });

      pastasInternas.forEach(pastaInt => {
        if (!pastaInt.isDirectory()) return;

        const caminhoCompleto = path.join(pastasInternasPath, pastaInt.name);
        const arquivos = fs.readdirSync(caminhoCompleto);

        // Procura arquivos Excel do diário
        arquivos.forEach(arquivo => {
          if (arquivo.includes('DIÁRIO') && arquivo.endsWith('.xlsx')) {
            const caminhoArquivo = path.join(caminhoCompleto, arquivo);

            // Tentar extrair turma do nome do arquivo
            const match = arquivo.match(/(\d{4})/);
            const turma = match ? match[1] : 'Desconhecida';

            diarios.push({
              id: diarios.length + 1,
              nome: arquivo,
              turma: turma,
              disciplina: pastaInt.name,
              caminho: caminhoArquivo
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Erro ao listar diários:', error);
  }

  return diarios;
}

// Função para determinar qual aba usar baseado na data
function obterAbaTrimestre(data) {
  const mes = new Date(data).getMonth() + 1;

  if (mes >= 2 && mes <= 5) return '1º TRIM';
  if (mes >= 5 && mes <= 8) return '2º TRIM';
  if (mes >= 9 && mes <= 12) return '3º TRIM';

  return '1º TRIM'; // padrão
}

// POST - Login
app.post('/api/login', (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ erro: 'Usuário e senha inválidos' });
    }

    const user = usuariosData.usuarios.find(
      u => u.usuario === usuario && u.senha === senha
    );

    if (!user) {
      return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
    }

    res.json({
      sucesso: true,
      usuario: {
        id: user.id,
        nome: user.nome,
        usuario: user.usuario,
        disciplina: user.disciplina
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

// GET - Listar todos os diários disponíveis
app.get('/api/diarios', (req, res) => {
  const diarios = listarDiarios();
  res.json(diarios);
});

// GET - Carregar dados (alunos, datas, etc)
app.get('/api/dados', async (req, res) => {
  try {
    const { diarioId } = req.query;

    if (!diarioId) {
      return res.status(400).json({ erro: 'ID do diário não informado' });
    }

    // Encontrar o diário
    const diarios = listarDiarios();
    const diario = diarios.find(d => d.id == diarioId);

    if (!diario) {
      return res.status(404).json({ erro: 'Diário não encontrado' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(diario.caminho);

    const worksheet = workbook.getWorksheet('1º TRIM');

    // Extrair alunos
    const alunos = [];
    for (let row = 4; row <= 100; row++) {
      const celula = worksheet.getCell(`B${row}`).value;
      if (celula && celula.trim()) {
        alunos.push({
          numero: row - 3,
          nome: celula.trim(),
          linha: row
        });
      } else {
        break;
      }
    }

    // Extrair datas
    const datas = [];
    for (let col = 4; col <= 78; col++) {
      const celula = worksheet.getCell(3, col);
      if (celula.value) {
        datas.push({
          coluna: col,
          data: celula.value
        });
      }
    }

    res.json({
      alunos,
      datas,
      turma: diario.turma,
      disciplina: diario.disciplina,
      diarioId: diario.id
    });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    res.status(500).json({ erro: 'Erro ao carregar dados' });
  }
});

// POST - Adicionar novo aluno
app.post('/api/adicionar-aluno', async (req, res) => {
  try {
    const { nome, diarioId } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'Nome do aluno inválido' });
    }

    if (!diarioId) {
      return res.status(400).json({ erro: 'ID do diário não informado' });
    }

    // Encontrar o diário
    const diarios = listarDiarios();
    const diario = diarios.find(d => d.id == diarioId);

    if (!diario) {
      return res.status(404).json({ erro: 'Diário não encontrado' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(diario.caminho);

    // Adicionar em todas as 3 abas de trimestre
    const abas = ['1º TRIM', '2º TRIM', '3º TRIM'];

    for (const aba of abas) {
      const worksheet = workbook.getWorksheet(aba);

      // Encontrar primeira linha vazia
      let linhaLivre = null;
      for (let row = 4; row <= 100; row++) {
        const celula = worksheet.getCell(`B${row}`).value;
        if (!celula) {
          linhaLivre = row;
          break;
        }
      }

      if (linhaLivre) {
        // Adicionar número
        const cell_num = worksheet.getCell(`A${linhaLivre}`);
        cell_num.value = linhaLivre - 3;
        cell_num.alignment = { horizontal: 'center' };

        // Adicionar nome
        const cell_nome = worksheet.getCell(`B${linhaLivre}`);
        cell_nome.value = nome.trim();

        // Adicionar fórmula de contagem de faltas
        const cell_faltas = worksheet.getCell(`BJ${linhaLivre}`);
        cell_faltas.value = `=COUNTIF(C${linhaLivre}:BJ${linhaLivre},"F")`;
        cell_faltas.alignment = { horizontal: 'center' };

        // Preencher com pontos vazios nas colunas de presença
        for (let col = 3; col <= 78; col++) {
          const cell = worksheet.getCell(linhaLivre, col);
          cell.alignment = { horizontal: 'center' };
        }
      }
    }

    await workbook.xlsx.writeFile(diario.caminho);

    res.json({
      sucesso: true,
      mensagem: `Aluno "${nome}" adicionado com sucesso!`
    });
  } catch (error) {
    console.error('Erro ao adicionar aluno:', error);
    res.status(500).json({ erro: 'Erro ao adicionar aluno' });
  }
});

// POST - Salvar presença
app.post('/api/salvar-presenca', async (req, res) => {
  try {
    const { data, conteudo, presencas, diarioId, professor } = req.body;

    if (!data || !presencas || Object.keys(presencas).length === 0) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    if (!diarioId) {
      return res.status(400).json({ erro: 'ID do diário não informado' });
    }

    // Encontrar o diário
    const diarios = listarDiarios();
    const diario = diarios.find(d => d.id == diarioId);

    if (!diario) {
      return res.status(404).json({ erro: 'Diário não encontrado' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(diario.caminho);

    const aba = obterAbaTrimestre(data);
    const worksheet = workbook.getWorksheet(aba);

    // Encontrar a coluna da data
    let colunaDado = null;
    for (let col = 4; col <= 78; col++) {
      const celula = worksheet.getCell(3, col);
      if (!celula.value) {
        colunaDado = col;
        break;
      }
    }

    if (!colunaDado) {
      return res.status(400).json({ erro: 'Sem espaço para nova data' });
    }

    // Adicionar data
    const cell_data = worksheet.getCell(3, colunaDado);
    cell_data.value = data;
    cell_data.alignment = { horizontal: 'center', vertical: 'center' };

    // Adicionar conteúdo se houver
    if (conteudo) {
      const cell_conteudo = worksheet.getCell(2, colunaDado);
      cell_conteudo.value = conteudo;
      cell_conteudo.alignment = { horizontal: 'center', wrap: true };
    }

    // Adicionar presenças
    for (let linha = 4; linha <= 100; linha++) {
      const numeroAluno = linha - 3;
      const presenca = presencas[numeroAluno];

      if (presenca) {
        const cell = worksheet.getCell(linha, colunaDado);

        if (presenca === 'P') {
          cell.value = '.'; // Presente = ponto
        } else if (presenca === 'F') {
          cell.value = 'F'; // Falta
        }

        cell.alignment = { horizontal: 'center', vertical: 'center' };
      }
    }

    await workbook.xlsx.writeFile(diario.caminho);

    res.json({
      sucesso: true,
      mensagem: 'Presenca salva com sucesso!',
      coluna: colunaDado,
      data: data
    });
  } catch (error) {
    console.error('Erro ao salvar:', error);
    res.status(500).json({ erro: 'Erro ao salvar presenca' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App rodando em http://localhost:${PORT}`);
  console.log('Acesse pelo navegador do celular com: http://SEU_IP:3000');
});
