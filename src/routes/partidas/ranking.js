const { db } = require("../../db");

const ranking = async (_req, res) => {
  try {
    const { rows } = await db.query(`-- sql
      SELECT
        ROW_NUMBER() OVER (ORDER BY SUM(p.pontuacao) DESC) AS posicao,
        u.id,
        u.nome,
        SUM(p.pontuacao)  AS pontuacao_total,
        COUNT(p.id)       AS partidas,
        MAX(p.created_at) AS ultima_jogada
      FROM usuarios u
      JOIN partidas p ON p.usuario_id = u.id
      GROUP BY u.id, u.nome
      ORDER BY pontuacao_total DESC
      LIMIT 10
    `);

    return res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return res.status(500).json({ error: "Erro ao buscar ranking" });
  }
};

module.exports = { ranking };
