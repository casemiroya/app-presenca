# 📁 Estrutura de Arquivos no Replit

## Como organizar seus diários no Replit

### Opção 1: Uploads diretos (Mais simples)

No Replit, crie esta estrutura:

```
seu-app-replit/
├── server.js
├── package.json
├── public/
│   └── index.html
├── diarios/
│   ├── DIÁRIO 1001 ISMÊNIA 2026.xlsx
│   ├── DIÁRIO 2001 FULANO 2026.xlsx
│   └── ... (mais diários)
└── node_modules/
```

**Como fazer:**
1. No Replit, clique no ícone de pasta (Files)
2. Clique em "+" e crie pasta `diarios`
3. Dentro de `diarios`, clique em "+" e "Upload file"
4. Selecione seus arquivos Excel e faça upload

---

### Opção 2: Sincronizar com Google Drive (Avançado)

Se tiver muitos arquivos, você pode sincronizar:

1. Coloque todos os diários em uma pasta do Google Drive
2. Use um serviço como IFTTT ou Zapier para sincronizar
3. Ou configure manualmente antes de cada aula

---

## ⚙️ Configurar no server.js

O `server.js` já está preparado para Replit.

Quando roda no Replit, automaticamente usa:
```javascript
const PASTA_DIARIOS = './diarios';
```

Quando roda localmente no seu PC, usa:
```javascript
const PASTA_DIARIOS = 'D:\\1. PROJETOS\\ESCOLA\\2026\\DIÁRIOS';
```

---

## 📤 Fórmula Rápida: 3 passos

1. **Upload dos arquivos:**
   - Pasta `diarios` → upload de `DIÁRIO XXXX.xlsx`

2. **Rodar o app:**
   - Clique no botão "Run"

3. **Acessar:**
   - URL do Replit será mostrada
   - Use no celular: `https://seu-app.replit.dev`

---

## 💾 Backup de Arquivos

Importante: Seus arquivos Excel são armazenados no Replit.

Para fazer backup:
1. No Replit, clique nos arquivos na aba "Files"
2. Clique com botão direito → "Download"
3. Salve no seu PC

---

## 🔄 Atualizações

Se precisar adicionar novos diários:

1. No Replit, vá para Files
2. Abra pasta `diarios`
3. Clique em "+" → "Upload file"
4. Selecione os novos diários
5. Recarregue a página do app (F5)

---

## ✅ Checklist Replit

- [ ] Pasta `diarios` criada no Replit
- [ ] Arquivos `.xlsx` com "DIÁRIO" no nome
- [ ] `npm install` executado
- [ ] `npm start` funcionando
- [ ] App carregando na URL pública
- [ ] Turmas aparecendo na primeira tela
- [ ] Conseguindo marcar presença

---

Pronto! Seu app está organizado e funcional no Replit.
