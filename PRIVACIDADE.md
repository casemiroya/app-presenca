# 🔐 Privacidade e Segurança dos Dados

## Proteção de Dados dos Alunos

Os arquivos Excel com **nomes e dados dos alunos** **NÃO** são versionados no GitHub.

### Por que?

- ✅ Lei de Proteção de Dados (LGPD no Brasil)
- ✅ Privacidade dos alunos e pais
- ✅ Segurança das informações

### Como funciona?

- 📁 Pasta `diarios/` está no `.gitignore`
- 📁 Arquivos `.xlsx` estão no `.gitignore`
- 📁 GitHub só tem o **código** (público)
- 🔒 Dados dos alunos ficam **locais ou no Replit** (privado)

---

## 📂 Armazenamento de Diários

### Local (seu computador)
```
D:\1. PROJETOS\ESCOLA\2026\DIÁRIOS\
├── app-presenca/          ← Código (no GitHub)
├── Matemática-xxxxx/
│   └── Matemática/
│       └── DIÁRIO 1001.xlsx  ← Dados (NÃO no GitHub)
└── ...
```

### Replit (nuvem)
```
seu-app/
├── server.js              ← Código (no GitHub)
├── public/index.html      ← Código (no GitHub)
└── diarios/ISMÊNIA/       ← Dados (NO REPLIT, privado)
    ├── Matemática/
    │   └── DIÁRIO 1001.xlsx
    └── Reforço Escolar/
        └── DIÁRIO 1002.xlsx
```

---

## 💾 Backup dos Diários

### Opção 1: Baixar do Replit
```
Replit → Files → diarios → Download
```

### Opção 2: Sincronizar com seu PC
```bash
# Seu PC
git pull origin main
# Depois copie os diários manualmente
```

### Opção 3: Google Drive
```
Copie a pasta diarios para Google Drive
Backup automático
```

---

## 🔒 Resumo de Segurança

| O quê | Onde | Privado? |
|-------|------|----------|
| Código da app | GitHub | ❌ Público |
| Nomes de alunos | Replit | ✅ Privado |
| Presenças | Replit | ✅ Privado |
| Arquivos Excel | Local (seu PC) | ✅ Privado |

---

## ⚠️ Boas Práticas

1. **Não compartilhe o link do Replit** com pessoas não autorizadas
2. **Faça backups regularmente** dos arquivos Excel
3. **Use senha forte** no GitHub
4. **Mantenha atualizado** para patches de segurança

---

## 📋 LGPD (Lei Geral de Proteção de Dados)

Você está cumprindo com a lei ao:
- ✅ Proteger dados dos menores
- ✅ Não armazenar em locais públicos
- ✅ Fazer backup regularmente
- ✅ Controlar quem tem acesso

---

**Seus dados estão seguros!** 🛡️
