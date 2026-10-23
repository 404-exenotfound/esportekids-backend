# Rotas da API de Usuários

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
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=aula
JWT_SECRET=sua-chave-secreta
PORT=3000
```
