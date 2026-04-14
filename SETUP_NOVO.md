# 🎓 App Diário Digital - Setup Novo

## ✅ O que foi criado/modificado

### 1. **Script de Migração** (`gerar_diarios.py`)
- Lê alunos das 6 planilhas existentes
- Gera 6 novas planilhas com estrutura adaptada
- Inclui suporte a 3 tempos de aula por dia
- Pré-formatado para avaliações (mínimo 3)

### 2. **6 Novas Planilhas** (pasta `diarios/`)
```
diarios/
├── DIÁRIO 1001 MATEMÁTICA 2026.xlsx (24 alunos)
├── DIÁRIO 1002 MATEMÁTICA 2026.xlsx (25 alunos)
├── DIÁRIO 1002 Reforço REFORÇO ESCOLAR DE MATEMÁTICA 2026.xlsx (25 alunos)
├── DIÁRIO 1003 MATEMÁTICA 2026.xlsx (25 alunos)
├── DIÁRIO 2001 MATEMÁTICA 2026.xlsx (25 alunos)
└── DIÁRIO 2003 MATEMÁTICA 2026.xlsx (25 alunos)
```

**Cada planilha possui:**
- 3 abas de presença (1º TRIM, 2º TRIM, 3º TRIM)
- 3 abas de avaliações (AVAL. E CONT 1º TRIM, etc)
- 1 aba de conselho final
- Alunos já migrados
- Fórmulas de cálculo de faltas

### 3. **Server.js Atualizado**
Novos endpoints:

| Endpoint | Função |
|----------|--------|
| `GET /api/diarios` | Lista turmas disponíveis |
| `GET /api/trimestres` | Lista trimestres (1º, 2º, 3º) |
| `GET /api/tempos` | Lista tempos de aula (T1, T2, T3) |
| `GET /api/dados` | Carrega alunos de um trimestre |
| `GET /api/avaliacoes` | Carrega notas de um trimestre |
| `POST /api/salvar-presenca` | Salva presença + conteúdo |
| `POST /api/salvar-avaliacao` | Salva nota de um aluno |
| `POST /api/salvar-conteudo` | Salva conteúdo do trimestre |
| `POST /api/adicionar-aluno` | Adiciona novo aluno |

### 4. **Interface Completamente Nova** (`index.html`)

**Telas disponíveis:**

1. **Seleção de Turma** (inicial)
   - Clica em uma turma para entrar

2. **Menu Principal** (após selecionar turma)
   - 3 botões: Presença | Notas | Conteúdo

3. **Tela de Presença**
   - Seletor de Trimestre (1º/2º/3º)
   - Seletor de Tempo de Aula (1º/2º/3º tempo)
   - Data da aula
   - Conteúdo da aula
   - Lista de alunos com botões P/F
   - Botão Adicionar Aluno

4. **Tela de Avaliações**
   - Seletor de Trimestre
   - Lista de alunos com 3 campos de nota (Av1, Av2, Av3)
   - Botão Salvar

5. **Tela de Conteúdos**
   - Seletor de Trimestre
   - Campo de texto para conteúdo
   - Botão Salvar

---

## 🚀 Como usar

### Opção 1: Rodar localmente
```bash
cd "D:\1. PROJETOS\ESCOLA\2026\DIÁRIOS\app-presenca"
npm start
```
Acesse: `http://localhost:3000` no navegador

### Opção 2: Acessar via celular (WiFi)
Mesma rede WiFi do notebook:
```
http://SEU_IP_DO_COMPUTADOR:3000
```
Ex: `http://192.168.1.100:3000`

### Opção 3: Deploy no Replit (online)
1. Faça push para GitHub
2. No Replit: Import from GitHub
3. Configure a variável de ambiente:
   ```
   PASTA_DIARIOS=./diarios
   ```

---

## 📋 Fluxo de Uso Diário

1. **Abrir app** → localhost:3000
2. **Clicar na turma** → Entra no menu principal
3. **Escolher ação:**
   - **Presença:** Seleciona trimestre + tempo + data → marca P/F para cada aluno → Salva
   - **Notas:** Seleciona trimestre → digita notas (Av1, Av2, Av3+) → Salva
   - **Conteúdo:** Seleciona trimestre → digita conteúdo do trimestre → Salva

---

## 💾 Onde os dados são salvos

Todos os dados vão direto para as planilhas Excel:

| Dados | Local na planilha |
|-------|-------------------|
| Presença | Linha 3 (datas) + Linhas 4+ (alunos) |
| Notas | Aba AVAL., colunas D-X (Av1-Av20) |
| Conteúdo | Aba AVAL., coluna AA |
| Aulas Dadas | Linha 2, coluna AB |
| Total de Faltas | Coluna AB de cada aluno |

---

## 🔧 Customizações Possíveis

Se precisar alterar:

### Número de avaliações
- Arquivo: `server.js`, linha ~160 (mudar loop de cols 4-24)
- HTML: `public/index.html`, linha ~600 (mudar loop de 3 campos para N)

### Número de tempos de aula
- Arquivo: `server.js` → `GET /api/tempos`
- HTML: `public/index.html` → seletor de tempos

### Trimestres
- Arquivo: `server.js` → `GET /api/trimestres`
- Gerar novas abas na planilha se adicionar trimestres

---

## ⚠️ Observações Importantes

1. **Backup:** As planilhas antigas (ISM ENO) ainda estão em `/Matemática-...`
2. **Dados Migrados:** 149 alunos já estão nas novas planilhas
3. **Professores Múltiplos:** Código simplificado para 1 professor (Leandro)
4. **Excel Aberto:** Feche o Excel se a planilha está aberta ao usar o app
5. **Data do Servidor:** Use a data correta ao marcar presença

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Nenhum diário encontrado" | Verifique pasta `diarios/` tem os .xlsx |
| App não salva | Feche Excel se tiver aberto |
| Erro de permissão | Execute com permissões de admin |
| Não conecta via WiFi | Verifique firewall, porta 3000 aberta |

---

**Tudo pronto! 🎉 App está rodando com suas 6 turmas!**

Próximos passos (opcional):
- [ ] Deploy no Replit
- [ ] Backup das planilhas existentes
- [ ] Testar todos os trimestres
- [ ] Documentação adicional para alunos
