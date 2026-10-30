const { db } = require("../../db");

// Nomes que a criança pode escolher no cadastro. Para liberar um nome
// novo é só adicionar aqui — o front busca esta lista em GET /nomes.
// Quando um nome já foi usado, o próximo vira Pedro2, Pedro3...
// Sem acento de propósito: fica fácil de digitar no login.
const NOMES = [
  "Joao",
  "Pedro",
  "Lucas",
  "Gabriel",
  "Miguel",
  "Maria",
  "Ana",
  "Julia",
  "Laura",
  "Sofia",
];

// Todos os nomes já cadastrados que vieram desta base: Pedro, Pedro2, Pedro3...
const buscarUsados = async (bases) => {
  const { rows } = await db.query(
    `-- sql
    SELECT nome FROM usuarios WHERE nome ~ $1`,
    [`^(${bases.join("|")})[0-9]*$`]
  );
  return rows.map((r) => r.nome);
};

// "Pedro" livre -> "Pedro"; usado -> "Pedro" + (maior número + 1)
const proximoNome = (base, usados) => {
  const numeros = usados
    .filter((nome) => nome === base || new RegExp(`^${base}[0-9]+$`).test(nome))
    .map((nome) => Number(nome.slice(base.length)) || 1);

  if (!numeros.length) return base;
  return `${base}${Math.max(...numeros) + 1}`;
};

// GET /nomes -> [{ base: "Pedro", proximo: "Pedro2" }]
const listarNomes = async (_req, res) => {
  try {
    const usados = await buscarUsados(NOMES);
    return res.json(NOMES.map((base) => ({ base, proximo: proximoNome(base, usados) })));
  } catch (error) {
    console.error("Erro ao listar nomes:", error);
    return res.status(500).json({ error: "Erro ao listar nomes" });
  }
};

module.exports = { NOMES, buscarUsados, proximoNome, listarNomes };
