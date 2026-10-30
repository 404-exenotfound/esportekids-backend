# CLAUDE.md — Backend (aula-segunda-back)

## Stack

- **Node.js** + **Express v5**
- **PostgreSQL** via `pg` (Pool com SSL `rejectUnauthorized: false` para AWS RDS)
- **Zod v4** — validação de entrada
- **bcrypt** — hash de senha (10 salt rounds)
- **jsonwebtoken** — tokens JWT (expiração 1h)

## Estrutura de pastas

```
/
├── index.js                  # Entrada: Express app, middlewares, mount de routers
├── setup.sql                 # Schema do banco (sintaxe PostgreSQL)
├── ROTAS.md                  # Documentação dos endpoints
├── src/
│   ├── db/
│   │   └── index.js          # Pool PostgreSQL exportado como { db }
│   └── routes/
│       └── user/
│           ├── index.js      # Factory: userRouter() → express.Router
│           ├── login.js      # Handler POST /login
│           └── registro.js   # Handler POST /registro
```

### Convenção para novos domínios

```
src/routes/
└── [dominio]/
    ├── index.js      # Factory que registra as rotas do domínio
    ├── listar.js     # Um arquivo por handler/ação
    ├── criar.js
    └── ...
```

Montar no `index.js` raiz:
```js
const quizRouter = require("./src/routes/quiz")
app.use("/", quizRouter())
```

## Padrões de código

### Handler (arquivo de rota)

```js
const { z } = require("zod")
const { db } = require("../../db")

const schema = z.object({
  campo: z.string().min(1),
})

const handler = async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() })
    }

    const { campo } = parsed.data

    const { rows } = await db.query(
      `SELECT * FROM tabela WHERE campo = $1`,
      [campo]
    )

    return res.json({ data: rows })
  } catch (error) {
    console.error("Erro em handler:", error)
    return res.status(500).json({ error: "Erro interno" })
  }
}

module.exports = { handler }
```

### Factory de router

```js
const express = require("express")
const { handler } = require("./handler")

const dominioRouter = () => {
  const router = express.Router()
  router.get("/rota", handler)
  return router
}

module.exports = dominioRouter
```

### Queries SQL

- Sempre parametrizadas com `$1, $2, ...` (nunca interpolação de string)
- Comentário `-- sql` na primeira linha para highlight de editor
- Desestruturar resultado como `const { rows } = await db.query(...)`

```js
const { rows } = await db.query(
  `-- sql
  SELECT id, nome FROM usuarios WHERE email = $1`,
  [email]
)
```

### Middleware de autenticação

```js
const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Token obrigatório" })
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: "Token inválido" })
  }
}

module.exports = { auth }
```

Usar em rotas protegidas:
```js
router.post("/partida", auth, salvarPartida)
```

## Banco de dados

**Conexão:** AWS RDS PostgreSQL (porta 5432, SSL sem verificação de certificado). Credenciais no `.env` (modelo em `.env.example`).

O arquivo `src/db/index.js` exporta um Pool já configurado — importar direto:
```js
const { db } = require("../../db") // ajustar caminho relativo
```

## Códigos HTTP usados

| Situação | Status |
|---|---|
| Sucesso | 200 |
| Criado | 201 |
| Validação falhou | 400 |
| Não autenticado | 401 |
| Conflito (ex: email duplicado) | 409 |
| Erro interno | 500 |

## Variáveis de ambiente

```env
JWT_SECRET=chave_secreta_aqui
DATABASE_URL=postgresql://...  # opcional, sobrescreve config do db/index.js
```
