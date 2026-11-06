// Cria (ou atualiza a senha de) o usuário "root", que pode liberar todos
// os jogos de uma vez no front. Não dá para criar pelo /registro, porque lá
// o nome tem que vir da lista fixa de nomes.
//
//   npm run criar-root
//
// Login: nome "root", senha SENHA abaixo. Rodar de novo só reaplica a senha.
require("dotenv").config({ quiet: true });
const bcrypt = require("bcrypt");
const { db } = require("../src/db");

const NOME = "root";
const SENHA = "root";

const main = async () => {
  const senhaHash = await bcrypt.hash(SENHA, 10);

  const { rows } = await db.query(
    `-- sql
    INSERT INTO usuarios (nome, senha, cargo)
    VALUES ($1, $2, 'root')
    ON CONFLICT (nome) DO UPDATE SET senha = EXCLUDED.senha, cargo = 'root'
    RETURNING id, nome, cargo`,
    [NOME, senhaHash]
  );

  console.log("Usuário root pronto:", rows[0]);
};

main()
  .catch((error) => {
    console.error("Erro ao criar root:", error);
    process.exitCode = 1;
  })
  .finally(() => db.end());
