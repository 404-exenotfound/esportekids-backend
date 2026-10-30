# Rotas da API

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Health Check
**GET** `/`

Verifica se a API está rodando.

**Resposta (200):**
```json
{
  "status": "ok",
  "message": "API rodando"
}
```

---

### 2. Login
**POST** `/login`

Realiza login de um usuário existente.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "usuario@example.com"
  }
}
```

**Erros:**
- **400:** Dados inválidos
- **401:** Credenciais inválidas (email ou senha incorretos)
- **500:** Erro ao processar login

---

### 3. Registro
**POST** `/registro`

Registra um novo usuário com senha hasheada usando bcrypt.

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com"
  }
}
```

**Erros:**
- **400:** Dados inválidos
- **409:** Email já cadastrado
- **500:** Erro ao processar registro

---

> Rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>` (401 sem token ou com token inválido/expirado).

### 4. Matérias
**GET** `/materias`

Lista as matérias. No EsporteKids, cada esporte é uma matéria (casada pelo nome).

**Resposta (200):**
```json
[{ "id": 6, "nome": "Basquete", "icone": "🏀" }]
```

---

### 5. Quiz 🔒
**GET** `/quiz?materias=1,2`

Até 10 perguntas aleatórias das matérias informadas (sem indicar a correta).

**Erros:** 400 (nenhuma matéria / IDs inválidos)

---

### 6. Salvar partida 🔒
**POST** `/partida`

Corrige no servidor as respostas de um quiz vindo de `/quiz`.

**Request Body:**
```json
{
  "materias": [1, 2],
  "respostas": [{ "pergunta_id": 10, "alternativa_id": 42 }]
}
```

**Resposta (201):**
```json
{ "partida_id": 1, "acertos": 7, "total_perguntas": 10, "pontuacao": 70 }
```

---

### 7. Salvar resultado 🔒
**POST** `/partida/resultado`

Grava um resultado já corrigido no cliente (quizzes locais do EsporteKids). Pontuação = `acertos * 10`.

**Request Body:**
```json
{ "materia_id": 6, "acertos": 3, "total_perguntas": 4 }
```

**Resposta (201):**
```json
{ "partida_id": 2, "acertos": 3, "total_perguntas": 4, "pontuacao": 30 }
```

**Erros:** 400 (dados inválidos, `acertos > total_perguntas` ou matéria inexistente)

---

### 8. Histórico 🔒
**GET** `/historico`

Últimas 20 partidas do usuário logado.

**Resposta (200):**
```json
[{ "id": 2, "pontuacao": 30, "acertos": 3, "total_perguntas": 4, "created_at": "2026-10-23T20:00:00.000Z", "materias": ["Basquete"] }]
```

---

### 9. Ranking 🔒
**GET** `/ranking`

Top 10 usuários pela soma das pontuações.

**Resposta (200):**
```json
[{ "posicao": "1", "id": 1, "nome": "João", "pontuacao_total": "120", "partidas": "4", "ultima_jogada": "2026-10-23T20:00:00.000Z" }]
```

> `posicao`, `pontuacao_total` e `partidas` chegam como **string** (bigint do PostgreSQL).

---

### 10. Admin (cargo `adm`) 🔒
- **GET** `/admin/perguntas`
- **POST** `/admin/perguntas`
- **PUT** `/admin/perguntas/:id`
- **DELETE** `/admin/perguntas/:id`

**Erros:** 403 se o usuário não for `adm`.

---

## Requisitos de Validação

- **Email:** Deve ser um email válido
- **Senha:** Mínimo de 6 caracteres
- **Nome:** Obrigatório (mínimo 1 caractere)

## Segurança

- As senhas são hasheadas usando **bcrypt** com 10 salt rounds
- Os tokens JWT expiram em **1 hora**
- JWT_SECRET pode ser configurado via variável de ambiente `JWT_SECRET`

## Variáveis de Ambiente

```bash
JWT_SECRET=sua-chave-secreta
DB_HOST=host-do-postgres
DB_DATABASE=defaultdb
DB_USER=doadmin
DB_PASSWORD=
PORT=3000
FRONTEND_URL=http://localhost:5173   # origem liberada no CORS
```
