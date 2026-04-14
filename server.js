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

// Pasta dos diários novos
const PASTA_DIARIOS = path.join(__dirname, 'diarios');

// Garantir que a pasta existe
if (!fs.existsSync(PASTA_DIARIOS)) {
  fs.mkdirSync(PASTA_DIARIOS, { recursive: true });
}

// Função para listar todos os diários disponíveis
function listarDiarios() {
  const diarios = [];

  try {
    const arquivos = fs.readdirSync(PASTA_DIARIOS);

    arquivos.forEach((arquivo, idx) => {
      if (arquivo.endsWith('.xlsx')) {
        const caminhoArquivo = path.join(PASTA_DIARIOS, arquivo);

        // Extrair turma do nome do arquivo (DIÁRIO 1001 MATEMÁTICA 2026.xlsx)
        const match = arquivo.match(/DIÁRIO\s+(\d{4}|\d{4}\s+\w+)/);
        const turma = match ? match[1].trim() : 'Desconhecida';

        // Extrair disciplina (MATEMÁTICA, REFORÇO, etc)
        const matchDisc = arquivo.match(/MATEMÁTICA|REFORÇO/i);
        const disciplina = matchDisc ? matchDisc[0] : 'Desconhecida';

        diarios.push({
          id: idx + 1,
          nome: arquivo,
          turma: turma,
          disciplina: disciplina,
          caminho: caminhoArquivo
        });
      }
    });
  } catch (error) {
    console.error('Erro ao listar diários:', error);
  }

  return diarios;
}

// GET - Listar todos os diários disponíveis
app.get('/api/diarios', (req, res) => {
  const diarios = listarDiarios();
  res.json(diarios);
});

// GET - Listar trimestres disponíveis
app.get('/api/trimestres', (req, res) => {
  res.json([
    { id: 1, nome: '1º TRIM', meses: 'Fevereiro, Março, Abril e Maio' },
    { id: 2, nome: '2º TRIM', meses: 'Maio, Junho, Julho e Agosto' },
    { id: 3, nome: '3º TRIM', meses: 'Setembro, Outubro, Novembro e Dezembro' }
  ]);
});

// GET - Listar tempos de aula
app.get('/api/tempos', (req, res) => {
  res.json([
    { id: 1, nome: '1º Tempo' },
    { id: 2, nome: '2º Tempo' },
    { id: 3, nome: '3º Tempo' }
  ]);
});

// GET - Carregar dados da turma (alunos, datas, etc)
app.get('/api/dados', async (req, res) => {
  try {
    const { diarioId, trimestre } = req.query;

    if (!diarioId || !trimestre) {
      return res.status(400).json({ erro: 'ID do diário e trimestre são obrigatórios' });
    }

    const diarios = listarDiarios();
    const diario = diarios.find(d => d.id == diarioId);

    if (!diario) {
      return res.status(404).json({ erro: 'Diário não encontrado' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(diario.caminho);

    // Mapear trimestre para nome da aba
    const abaTrimestre = {
      '1': '1º TRIM',
      '2': '2º TRIM',
      '3': '3º TRIM'
    };

    const worksheet = workbook.getWorksheet(abaTrimestre[trimestre]);
    if (!worksheet) {
      return res.status(404).json({ erro: 'Trimestre não encontrado' });
    }

    // Extrair alunos
    const alunos = [];
    for (let row = 4; row <= 300; row++) {
      const celula = worksheet.getCell(`B${row}`).value;
      if (celula && String(celula).trim()) {
        alunos.push({
          numero: row - 3,
          nome: String(celula).trim(),
          linha: row
        });
      } else if (row > 10) { // Se passou de linha 10 sem alunos, para
        break;
      }
    }

    // Extrair datas (linha 3, a partir da coluna D/4)
    const datas = [];
    for (let col = 4; col <= 100; col++) {
      const celula = worksheet.getCell(3, col);
      if (celula.value) {
        datas.push({
          coluna: col,
          data: celula.value
        });
      }
    }

    workbook.close();

    res.json({
      alunos,
      datas,
      turma: diario.turma,
      disciplina: diario.disciplina,
      trimestre: abaTrimestre[trimestre],
      diarioId: diario.id
    });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    res.status(500).json({ erro: 'Erro ao carregar dados: ' + error.message });
  }
});

// GET - Carregar avaliações
app.get('/api/avaliacoes', async (req, res) => {
  try {
    const { diarioId, trimestre } = req.query;

    if (!diarioId || !trimestre) {
      return res.status(400).json({ erro: 'ID do diário e trimestre são obrigatórios' });
    }

    const diarios = listarDiarios();
    const diario = diarios.find(d => d.id == diarioId);

    if (!diario) {
      return res.status(404).json({ erro: 'Diário não encontrado' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(diario.caminho);

    const abaAval = {
      '1': 'AVAL. E CONT 1º TRIM',
      '2': 'AVAL. E CONT 2º TRIM',
      '3': 'AVAL. E CONT 3ºTRIM'
    };

    const worksheet = workbook.getWorksheet(abaAval[trimestre]);
    if (!worksheet) {
      return res.status(404).json({ erro: 'Aba de avaliações não encontrada' });
    }

    // Extrair alunos e avaliações
    const avaliacoes = [];
    for (let row = 4; row <= 300; row++) {
      const nome = worksheet.getCell(`B${row}`).value;
      if (nome && String(nome).trim()) {
        const notas = [];
        // Colunas D-X (4-24) = notas
        for (let col = 4; col <= 24; col++) {
          const nota = worksheet.getCell(row, col).value;
          notas.push({
            coluna: col,
            valor: nota || ''
          });
        }

        avaliacoes.push({
          numero: row - 3,
          nome: String(nome).trim(),
          linha: row,
          notas
        });
      } else if (row > 10) {
        break;
      }
    }

    workbook.close();

    res.json({
      avaliacoes,
      turma: diario.turma,
      trimestre: abaAval[trimestre],
      diarioId: diario.id
    });
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error);
    res.status(500).json({ erro: 'Erro ao carregar avaliações' });
  }
});

// POST - Salvar presença (com suporte a tempos de aula)
app.post('/api/salvar-presenca', async (req, res) => {
  try {
    const { data, conteudo, presencas, diarioId, trimestre, tempo } = req.body;

    if (!data || !presencas || Object.keys(presencas).length === 0 || !diarioId || !trimestre) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    const diarios = listarDiarios();
    const diario = diarios.find(d => d.id == diarioId);

    if (!diario) {
      return res.status(404).json({ erro: 'Diário não encontrado' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(diario.caminho);

    const abaTrimestre = {
      '1': '1º TRIM',
      '2': '2º TRIM',
      '3': '3º TRIM'
    };

    const worksheet = workbook.getWorksheet(abaTrimestre[trimestre]);
    if (!worksheet) {
      return res.status(404).json({ erro: 'Trimestre não encontrado' });
    }

    // Encontrar a próxima coluna vazia para a data
    let colunaDado = null;
    for (let col = 4; col <= 100; col++) {
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

    // Adicionar tempo de aula (T1, T2, T3) na célula logo abaixo se especificado
    if (tempo) {
      const tempoLabels = { '1': 'T1', '2': 'T2', '3': 'T3' };
      // Aqui pode adicionar lógica adicional se necessário
    }

    // Salvar conteúdo na aba de AVALIAÇÃO correspondente
    if (conteudo && conteudo.trim()) {
      try {
        const abaAval = {
          '1': 'AVAL. E CONT 1º TRIM',
          '2': 'AVAL. E CONT 2º TRIM',
          '3': 'AVAL. E CONT 3ºTRIM'
        };

        const wsAval = workbook.getWorksheet(abaAval[trimestre]);
        if (wsAval) {
          // Coluna AA (27) = CONTEÚDO - procura primeira linha vazia
          let linha_conteudo = 4;
          for (let row = 4; row <= 300; row++) {
            const val = wsAval.getCell(row, 27).value;
            if (!val || !String(val).trim()) {
              linha_conteudo = row;
              break;
            }
          }
          wsAval.getCell(linha_conteudo, 27).value = `${data}: ${conteudo.trim()}`;
        }
      } catch (err) {
        console.error('Erro ao salvar conteúdo:', err);
      }
    }

    // Adicionar presenças
    for (let linha = 4; linha <= 300; linha++) {
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

    // Incrementar AULAS DADAS (linha 2, coluna AB/28)
    const celAulasDadas = worksheet.getCell(2, 28);
    const valorAtual = parseInt(celAulasDadas.value || 0);
    celAulasDadas.value = valorAtual + 1;

    await workbook.xlsx.writeFile(diario.caminho);
    workbook.close();

    res.json({
      sucesso: true,
      mensagem: 'Presença salva com sucesso!',
      coluna: colunaDado,
      data: data
    });
  } catch (error) {
    console.error('Erro ao salvar presença:', error);
    res.status(500).json({ erro: 'Erro ao salvar presença: ' + error.message });
  }
});

// POST - Salvar avaliação (nota)
app.post('/api/salvar-avaliacao', async (req, res) => {
  try {
    const { diarioId, trimestre, numeroAluno, numeroAvaliacao, nota } = req.body;

    if (!diarioId || !trimestre || !numeroAluno || !numeroAvaliacao) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    const diarios = listarDiarios();
    const diario = diarios.find(d => d.id == diarioId);

    if (!diario) {
      return res.status(404).json({ erro: 'Diário não encontrado' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(diario.caminho);

    const abaAval = {
      '1': 'AVAL. E CONT 1º TRIM',
      '2': 'AVAL. E CONT 2º TRIM',
      '3': 'AVAL. E CONT 3ºTRIM'
    };

    const worksheet = workbook.getWorksheet(abaAval[trimestre]);
    if (!worksheet) {
      return res.status(404).json({ erro: 'Aba de avaliações não encontrada' });
    }

    // Linha do aluno = 3 + numeroAluno
    const linhaAluno = 3 + numeroAluno;
    // Coluna da avaliação = 3 + numeroAvaliacao (D=4 é AV1, E=5 é AV2, etc)
    const colunaAvaliacao = 3 + numeroAvaliacao;

    // Salvar nota
    worksheet.getCell(linhaAluno, colunaAvaliacao).value = nota || '';

    // Recalcular total (coluna Y/25)
    let soma = 0;
    let count = 0;
    for (let col = 4; col <= 24; col++) {
      const val = worksheet.getCell(linhaAluno, col).value;
      if (val && !isNaN(val)) {
        soma += parseFloat(val);
        count++;
      }
    }
    const media = count > 0 ? (soma / count).toFixed(2) : 0;
    worksheet.getCell(linhaAluno, 25).value = media; // Coluna Y

    await workbook.xlsx.writeFile(diario.caminho);
    workbook.close();

    res.json({
      sucesso: true,
      mensagem: 'Avaliação salva com sucesso!',
      nota: nota,
      media: media
    });
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    res.status(500).json({ erro: 'Erro ao salvar avaliação: ' + error.message });
  }
});

// POST - Salvar conteúdo do trimestre
app.post('/api/salvar-conteudo', async (req, res) => {
  try {
    const { diarioId, trimestre, conteudo } = req.body;

    if (!diarioId || !trimestre || !conteudo) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    const diarios = listarDiarios();
    const diario = diarios.find(d => d.id == diarioId);

    if (!diario) {
      return res.status(404).json({ erro: 'Diário não encontrado' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(diario.caminho);

    const abaAval = {
      '1': 'AVAL. E CONT 1º TRIM',
      '2': 'AVAL. E CONT 2º TRIM',
      '3': 'AVAL. E CONT 3ºTRIM'
    };

    const worksheet = workbook.getWorksheet(abaAval[trimestre]);
    if (!worksheet) {
      return res.status(404).json({ erro: 'Aba de avaliações não encontrada' });
    }

    // Salvar conteúdo na coluna AA (27) - próxima linha vazia
    let linhaConteudo = 4;
    for (let row = 4; row <= 300; row++) {
      const val = worksheet.getCell(row, 27).value;
      if (!val || !String(val).trim()) {
        linhaConteudo = row;
        break;
      }
    }

    worksheet.getCell(linhaConteudo, 27).value = conteudo.trim();

    await workbook.xlsx.writeFile(diario.caminho);
    workbook.close();

    res.json({
      sucesso: true,
      mensagem: 'Conteúdo salvo com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao salvar conteúdo:', error);
    res.status(500).json({ erro: 'Erro ao salvar conteúdo: ' + error.message });
  }
});

// POST - Adicionar novo aluno
app.post('/api/adicionar-aluno', async (req, res) => {
  try {
    const { nome, diarioId, trimestre } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'Nome do aluno inválido' });
    }

    if (!diarioId) {
      return res.status(400).json({ erro: 'ID do diário não informado' });
    }

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
      if (!worksheet) continue;

      // Encontrar primeira linha vazia
      let linhaLivre = null;
      for (let row = 4; row <= 300; row++) {
        const celula = worksheet.getCell(`B${row}`).value;
        if (!celula || !String(celula).trim()) {
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
      }
    }

    // Adicionar também nas abas de avaliação
    const abasAval = ['AVAL. E CONT 1º TRIM', 'AVAL. E CONT 2º TRIM', 'AVAL. E CONT 3ºTRIM'];

    for (const aba of abasAval) {
      const worksheet = workbook.getWorksheet(aba);
      if (!worksheet) continue;

      let linhaLivre = null;
      for (let row = 4; row <= 300; row++) {
        const celula = worksheet.getCell(`B${row}`).value;
        if (!celula || !String(celula).trim()) {
          linhaLivre = row;
          break;
        }
      }

      if (linhaLivre) {
        const cell_num = worksheet.getCell(`A${linhaLivre}`);
        cell_num.value = linhaLivre - 3;

        const cell_nome = worksheet.getCell(`B${linhaLivre}`);
        cell_nome.value = nome.trim();

        const cell_numero = worksheet.getCell(`C${linhaLivre}`);
        cell_numero.value = linhaLivre - 3;
      }
    }

    await workbook.xlsx.writeFile(diario.caminho);
    workbook.close();

    res.json({
      sucesso: true,
      mensagem: `Aluno "${nome}" adicionado com sucesso!`
    });
  } catch (error) {
    console.error('Erro ao adicionar aluno:', error);
    res.status(500).json({ erro: 'Erro ao adicionar aluno: ' + error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App rodando em http://localhost:${PORT}`);
  console.log('Acesse pelo navegador do celular com: http://SEU_IP:3000');
  console.log(`Diarios carregados de: ${PASTA_DIARIOS}`);
});
