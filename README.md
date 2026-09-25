# esportekids-backend

API em Flask + PostgreSQL rodando em Docker.

## Rodando

```bash
cp .env.example .env      # se ainda não existir
docker compose up -d --build
curl http://localhost:5000/health
```

A tabela `users` é criada automaticamente pelo `database/init.sql` na primeira vez que o
volume do Postgres é criado. Se alterar o SQL, recrie o volume: `docker compose down -v`.

## Estrutura

```
init.py                          # main(): função pai que sobe o servidor
src/app.py                       # create_app(): config do Flask, JWT, rotas
src/config.py                    # variáveis de ambiente
src/database.py                  # conexão com o Postgres
src/http/controller/user/route.py
src/useCase/user/create.py       # cadastro (SQL direto no caso de uso)
src/useCase/user/login.py        # login + geração do JWT
src/useCase/user/me.py           # usuário logado
bruno/                           # collection do Bruno
```

## Endpoints

| Método | Rota           | Body                                   | Resposta |
|--------|----------------|----------------------------------------|----------|
| POST   | `/users`       | `{name, password, passwordConfirm}`    | 201 / 409 nome em uso / 422 validação |
| POST   | `/users/login` | `{name, password}`                     | 200 `{accessToken}` / 401 |
| GET    | `/users/me`    | Header `Authorization: Bearer <token>` | 200 / 401 |

## Bruno

Abra a pasta `bruno/` no Bruno, selecione o ambiente `local` e rode a collection.
O request **Login** salva o token na variável `token`, usada pelo **Me**.
