# 🚀 Guia Completo: Deploy no Replit

Siga este passo a passo para colocar o app funcionando na nuvem (Replit).

## Passo 1: Preparar os arquivos

1. Você já tem todos os arquivos prontos em:
   ```
   D:\1. PROJETOS\ESCOLA\2026\DIÁRIOS\app-presenca\
   ```

2. Os arquivos necessários:
   - ✅ `server.js` (backend)
   - ✅ `package.json` (dependências)
   - ✅ `public/index.html` (interface)
   - ✅ `.replit` (configuração Replit)

## Passo 2: Criar conta no Replit

1. Acesse: https://replit.com
2. Clique em **"Sign up"** (ou faça login se já tem conta)
3. Use email ou GitHub

## Passo 3: Criar novo Repl

1. Clique em **"Create Repl"** (botão azul)
2. Escolha **"Node.js"** como linguagem
3. Dê um nome: `app-presenca` (ou como preferir)
4. Clique em **"Create Repl"**

## Passo 4: Fazer upload dos arquivos

### Opção A: GitHub (Recomendado)

1. No seu computador, abra PowerShell na pasta `app-presenca`:
   ```powershell
   cd "D:\1. PROJETOS\ESCOLA\2026\DIÁRIOS\app-presenca"
   ```

2. Inicie um repositório Git:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Crie um repositório no GitHub (github.com > New repository)

4. Conecte e suba os arquivos:
   ```powershell
   git remote add origin https://github.com/seu-usuario/seu-repo.git
   git branch -M main
   git push -u origin main
   ```

5. No Replit, clique em **"Import from GitHub"**
6. Cole a URL do seu repositório
7. Clique **"Import"**

### Opção B: Copiar arquivos (Mais fácil agora)

1. No Replit, você tem um editor de código
2. Copie o conteúdo de cada arquivo e cole no Replit:
   - `server.js` → crie arquivo e cole
   - `package.json` → crie arquivo e cole
   - `public/index.html` → crie pasta `public` e arquivo dentro

## Passo 5: Instalar dependências

1. No Replit, abra o terminal (aba "Shell")
2. Digite:
   ```bash
   npm install
   ```
3. Aguarde até terminar (vai instalar express, exceljs, etc)

## Passo 6: Configurar pasta de diários

⚠️ **IMPORTANTE:** No Replit, você precisa de uma forma de acessar seus arquivos Excel.

### Opção A: Upload de arquivos (Melhor para começar)

1. No Replit, clique em ícone de arquivo
2. Crie pasta: `diarios`
3. Faça upload dos seus `DIÁRIO XXXX.xlsx`

Depois no `server.js`, mude:
```javascript
const PASTA_DIARIOS = './diarios'; // ao invés do caminho do Windows
```

### Opção B: Google Drive (Mais prático a longo prazo)

Você pode integrar Google Drive, mas é mais complexo.

## Passo 7: Rodar o app

1. No Replit, clique no botão **"Run"** (verde no topo)
2. O app inicia automaticamente
3. Você vê o URL: `https://seu-app.replit.dev`

## Passo 8: Acessar pelo celular

1. Na escola, conecte o celular no WiFi
2. Abra o navegador e acesse:
   ```
   https://seu-app.replit.dev
   ```
3. Pronto! Pode marcar presença

---

## ✅ Teste Rápido

1. Selecione uma turma
2. Marque alguns alunos como presentes
3. Clique "Salvar Presença"
4. Verifique se salvou no arquivo Excel

---

## 🆘 Troubleshooting

### "Cannot find module 'express'"
- Rode: `npm install` novamente no terminal

### "Nenhum diário encontrado"
- Certifique-se que os arquivos estão em `./diarios`
- Nomes dos arquivos devem ter "DIÁRIO"

### Arquivo não salva
- Verificar permissões da pasta
- Fechar Excel se estiver aberto

### Replit ficou lento
- Normal em plano gratuito
- Recarregue a página

---

## 📌 Próximos Passos (Opcional)

Depois que tudo estiver funcionando, você pode:

1. **Usar Google Sheets** ao invés de Excel (mais fácil)
2. **Integrar OneDrive** para sincronizar automaticamente
3. **Criar domínio customizado** para o app

---

## 💡 Dicas

- **Backup automático:** Replit faz backup automático
- **Offline:** O app funciona online. Para offline, use a versão local
- **Múltiplas turmas:** O app detecta todas automaticamente
- **Adicionar aluno:** Usa o botão "+ Adicionar Novo Aluno" na interface

---

**Pronto! Seu app está no ar!** 🎉

Qualquer dúvida, volte neste guia ou revise o passo que não entendeu.
