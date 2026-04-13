# ⚙️ Setup Inicial

Siga os passos para configurar o app.

## 🔧 Teste Local (Seu Computador)

### 1. Instalar Node.js (se não tiver)
- Download: https://nodejs.org/
- Versão recomendada: LTS (Long Term Support)
- Instale normalmente

### 2. Abrir terminal na pasta do app
```powershell
cd "D:\1. PROJETOS\ESCOLA\2026\DIÁRIOS\app-presenca"
```

### 3. Instalar dependências
```bash
npm install
```

Você verá muitas linhas sendo instaladas. Aguarde terminar.

### 4. Rodar o app
```bash
npm start
```

Você verá:
```
App rodando em http://localhost:3000
Acesse pelo navegador do celular com: http://SEU_IP:3000
```

### 5. Acessar no celular
1. Seu PC: pega o IP local (abra CMD e digite `ipconfig`)
   Procure por "IPv4 Address" (algo como 192.168.x.x)

2. Celular conectado no WiFi da escola (mesmo WiFi do PC)

3. No navegador do celular: `http://192.168.x.x:3000`

---

## ☁️ Deploy no Replit

Veja o guia completo em: **GUIA_REPLIT.md**

Resumo:
1. Crie conta em replit.com
2. Importe este projeto (ou crie novo)
3. Clique em "Run"
4. Acesse: `https://seu-app.replit.dev`

---

## ✅ Checklist

- [ ] Node.js instalado
- [ ] Pasta `app-presenca` aberta no terminal
- [ ] `npm install` executado com sucesso
- [ ] `npm start` rodando
- [ ] App acessível em `http://localhost:3000`
- [ ] Alunos aparecem na tela
- [ ] Consegue marcar presença
- [ ] Arquivo Excel atualiza

---

## 🚨 Se der erro

**Erro: npm not found**
- Node.js não está instalado
- Reinstale de https://nodejs.org/

**Erro: ENOENT (arquivo não encontrado)**
- Verifique caminho dos diários
- Certifique-se que há arquivos com "DIÁRIO" no nome

**Porta 3000 em uso**
- Outro app está usando a porta
- Mude em `server.js`: `const PORT = 3000;` → `const PORT = 4000;`

---

Qualquer dúvida, volte neste arquivo ou revise os passos.
