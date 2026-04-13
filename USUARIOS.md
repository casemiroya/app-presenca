# 👥 Gerenciamento de Usuários (Professores)

## Como Funciona

O app agora tem **login com usuário e senha**.

Cada professor tem suas credenciais próprias no arquivo `usuarios.json`.

---

## 📋 Arquivo `usuarios.json`

```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "Leandro Casemiro",
      "usuario": "leandro",
      "senha": "123456",
      "disciplina": "Matemática",
      "ativo": true
    },
    {
      "id": 2,
      "nome": "Professor Demo",
      "usuario": "demo",
      "senha": "demo123",
      "disciplina": "Português",
      "ativo": true
    }
  ]
}
```

---

## ➕ Adicionar um Novo Professor

### **Local (seu PC)**

1. Abra: `D:\1. PROJETOS\ESCOLA\2026\DIÁRIOS\app-presenca\usuarios.json`

2. Copie este modelo:
```json
{
  "id": 3,
  "nome": "Nome do Professor",
  "usuario": "seu_usuario",
  "senha": "sua_senha",
  "disciplina": "Sua Disciplina",
  "ativo": true
}
```

3. Cole **dentro** do array `usuarios`:
```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "Leandro Casemiro",
      ...
    },
    {
      "id": 2,
      "nome": "Professor Demo",
      ...
    },
    {
      "id": 3,
      "nome": "Novo Professor",      ← AQUI
      "usuario": "novo",
      "senha": "senha123",
      "disciplina": "Matemática",
      "ativo": true
    }
  ]
}
```

4. Salve o arquivo (Ctrl+S)

---

### **No Replit**

1. No Replit, clique em **Files**
2. Abra `usuarios.json`
3. Adicione o novo usuário no editor
4. Clique em **Save**

---

## 🔐 Dicas de Segurança

✅ **Use senhas fortes** (não use "123456")  
✅ **Mude a senha padrão** do Leandro  
✅ **Senhas diferentes** para cada professor  
✅ **Ninguém compartilha login** (cada um tem o seu)  

---

## 🔧 Campos

| Campo | O quê | Exemplo |
|-------|-------|---------|
| `id` | Número único | 1, 2, 3... |
| `nome` | Nome completo do professor | "Maria Silva" |
| `usuario` | Username para login | "maria" |
| `senha` | Senha para login | "senha123" |
| `disciplina` | Disciplina que leciona | "Português" |
| `ativo` | Se pode usar? (true/false) | true |

---

## 🚀 Fluxo de Uso

1. **Professor abre o app**
   ```
   Tela de Login
   ```

2. **Digita usuário e senha**
   ```
   Usuário: maria
   Senha: senha123
   ```

3. **Clica em "Entrar"**
   ```
   ✓ Acesso às turmas
   ```

4. **Marca presença**
   ```
   Professor Maria marcou a presença
   ```

5. **Clica em "Sair"**
   ```
   Volta para login
   ```

---

## ❌ Desativar um Professor

Se um professor não deve mais usar o app, mude:

```json
"ativo": false
```

(Você pode fazer isso depois, se necessário)

---

## 🎯 Exemplo Completo

Arquivo `usuarios.json` com 3 professores:

```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "Leandro Casemiro",
      "usuario": "leandro",
      "senha": "sen@123",
      "disciplina": "Matemática",
      "ativo": true
    },
    {
      "id": 2,
      "nome": "Maria Silva",
      "usuario": "maria",
      "senha": "mar@456",
      "disciplina": "Português",
      "ativo": true
    },
    {
      "id": 3,
      "nome": "João Santos",
      "usuario": "joao",
      "senha": "joa@789",
      "disciplina": "Ciências",
      "ativo": true
    }
  ]
}
```

---

## 📝 Passo a Passo para Adicionar

1. Copie um usuário existente
2. Mude `id` (número diferente)
3. Mude `nome` (nome do professor)
4. Mude `usuario` (sem espaços, sem acentos)
5. Mude `senha` (senha forte)
6. Mude `disciplina` (disciplina que leciona)
7. Deixe `ativo` como `true`
8. Salve o arquivo

---

## ⚙️ Depois de Adicionar

1. No Replit, clique em "Run"
2. App reinicia e carrega os novos usuários
3. Novo professor pode fazer login!

---

**Pronto! Cada professor pode ter seu próprio login!** 🔐

