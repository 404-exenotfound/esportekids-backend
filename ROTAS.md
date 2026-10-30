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

Entra com o nome de jogador (sem diferenciar maiúscula/minúscula) e a senha.

**Request Body:**
```json
{
  "nome": "Pedro2",
  "senha": "senha123"
}
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { "id": 1, "nome": "Pedro2", "cargo": "cliente" }
}
```

**Erros:**
- **400:** Dados inválidos
- **401:** Nome ou senha incorretos
- **500:** Erro ao processar login

---

### 3. Nomes disponíveis
**GET** `/nomes`

Lista de nomes que podem ser escolhidos no cadastro (definida em `src/routes/user/nomes.js`) e o nome que a pessoa vai receber se escolher cada um agora.

**Resposta (200):**
```json
[
  { "base": "Joao",  "proximo": "Joao" },
  { "base": "Pedro", "proximo": "Pedro2" }
]
```

---

### 4. Registro
**POST** `/registro`

Cria a conta com um nome da lista. Se o nome já foi usado, recebe o próximo número (`Pedro` → `Pedro2` → `Pedro3`...). Senha com hash bcrypt.

**Request Body:**
```json
{
  "nome": "Pedro",
  "senha": "senha123"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { "id": 1, "nome": "Pedro2", "cargo": "cliente" }
}
```

**Erros:**
- **400:** Dados inválidos (nome fora da lista ou senha curta)
- **409:** Nome escolhido por outra pessoa ao mesmo tempo (tentar de novo)
- **500:** Erro ao processar registro

---

> Rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>` (401 sem token ou com token inválido/expirado).

### 5. Matérias
**GET** `/materias`

Lista as matérias. No EsporteKids, cada esporte é uma matéria (casada pelo nome).

**Resposta (200):**
```json
[{ "id": 6, "nome": "Basquete", "icone": "🏀" }]
```

---

### 6. Quiz 🔒
**GET** `/quiz?materias=1,2`

Até 10 perguntas aleatórias das matérias informadas (sem indicar a correta).

**Erros:** 400 (nenhuma matéria / IDs inválidos)

---

### 7. Salvar partida 🔒
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

### 8. Salvar resultado 🔒
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

### 9. Histórico 🔒
**GET** `/historico`

Últimas 20 partidas do usuário logado.

**Resposta (200):**
```json
[{ "id": 2, "pontuacao": 30, "acertos": 3, "total_perguntas": 4, "created_at": "2026-10-23T20:00:00.000Z", "materias": ["Basquete"] }]
```

---

### 10. Ranking 🔒
**GET** `/ranking`

Top 10 usuários pela soma das pontuações (empate = mesma posição; desempata a ordem quem chegou primeiro).

**Resposta (200):**
```json
[{ "posicao": 1, "id": 1, "nome": "João", "pontuacao_total": 120, "partidas": 4, "acertos": 12, "total_perguntas": 20, "melhor_partida": 50, "ultima_jogada": "2026-10-23T20:00:00.000Z" }]
```

---

### 11. Minha posição no ranking 🔒
**GET** `/ranking/eu`

Posição do usuário logado no ranking geral (mesmo fora do top 10).

**Resposta (200):**
```json
{ "posicao": 14, "id": 3, "nome": "Ana", "pontuacao_total": 40, "partidas": 2, "acertos": 4, "total_perguntas": 10, "melhor_partida": 30, "total_jogadores": 25 }
```

> Quem ainda não jogou recebe `posicao: null` e os totais zerados.

---

### 12. Admin (cargo `adm`) 🔒
- **GET** `/admin/perguntas`
- **POST** `/admin/perguntas`
- **PUT** `/admin/perguntas/:id`
- **DELETE** `/admin/perguntas/:id`

**Erros:** 403 se o usuário não for `adm`.

---

## Requisitos de Validação

- **Senha:** Mínimo de 6 caracteres
- **Nome:** No cadastro, um dos nomes de `GET /nomes`

## Segurança

- As senhas são hasheadas usando **bcrypt** com 10 salt rounds
- Os tokens JWT expiram em **1 hora**
- JWT_SECRET pode ser configurado via variável de ambiente `JWT_SECRET`

## Variáveis de Ambiente

```bash
JWT_SECRET=sua-chave-secreta
DB_HOST=seu-banco.xxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=
PORT=3000
FRONTEND_URL=http://localhost:5173   # origem liberada no CORS
```
