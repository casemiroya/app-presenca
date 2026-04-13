# 📋 App Presença Digital

App para marcar presença de alunos direto pelo celular, salvando automaticamente nos arquivos Excel dos diários.

## ✨ Funcionalidades

- ✅ Marcar presença dos alunos (Presente ou Falta)
- ✅ Anotar conteúdo da aula
- ✅ Adicionar novos alunos
- ✅ Funciona com múltiplas turmas
- ✅ Salva direto no arquivo Excel original
- ✅ Interface responsiva para celular

## 🚀 Como usar

### Opção 1: Rodar localmente

```bash
npm install
npm start
```

Depois acessa: `http://localhost:3000` ou `http://seu-ip:3000` pelo celular

### Opção 2: Deploy no Replit (Recomendado)

1. Acesse [replit.com](https://replit.com)
2. Clique em "Create Repl"
3. Escolha "Import from GitHub"
4. Cole esse repositório
5. Clique "Import Repl"
6. Clique no botão "Run"

O app ficará disponível em: `https://seu-app.replit.dev`

## 📁 Estrutura esperada

Seus arquivos de diário devem estar na pasta:
```
D:\1. PROJETOS\ESCOLA\2026\DIÁRIOS\
├── app-presenca\              ← App fica aqui
├── Disciplina-XXXXX\
│   └── Disciplina\
│       └── DIÁRIO XXXX YYYY.xlsx
└── ...
```

O app **procura automaticamente** por arquivos com "DIÁRIO" no nome e exibe na tela inicial.

## 💻 Tecnologia

- **Backend:** Node.js + Express
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Dados:** ExcelJS (lê e escreve em Excel)

## ⚙️ Variáveis de Ambiente

Se estiver usando no Replit com OneDrive/Google Drive, você pode configurar:

```
PASTA_DIARIOS=seu-caminho-aqui
```

Padrão: `D:\1. PROJETOS\ESCOLA\2026\DIÁRIOS`

## 🔧 Troubleshooting

**"Nenhum diário encontrado"**
- Certifique-se que os arquivos Excel têm "DIÁRIO" no nome
- Verifique se estão na pasta correta

**App não salva**
- Verifique permissões de pasta
- Feche o Excel se estiver aberto (pode travar arquivo)
- Tente novamente após fechar

**Servidor dorme no Replit**
- Normal em plano gratuito
- Demora 10-15s para acordar na próxima requisição

## 📝 Licença

Uso livre para escola

---

**Criado com ❤️ para facilitar a vida do professor**
