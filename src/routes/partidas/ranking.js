const { db } = require("../../db");

const ranking = async (_req, res) => {
  try {
    // ::int porque SUM/COUNT voltam bigint, que o pg entrega como string
    const { rows } = await db.query(`-- sql
      SELECT
        (RANK() OVER (ORDER BY SUM(p.pontuacao) DESC))::int AS posicao,
        u.id,
        u.nome,
        SUM(p.pontuacao)::int       AS pontuacao_total,
        COUNT(p.id)::int            AS partidas,
        SUM(p.acertos)::int         AS acertos,
        SUM(p.total_perguntas)::int AS total_perguntas,
        MAX(p.pontuacao)            AS melhor_partida,
        MAX(p.created_at)           AS ultima_jogada
      FROM usuarios u
      JOIN partidas p ON p.usuario_id = u.id
      GROUP BY u.id, u.nome
      ORDER BY pontuacao_total DESC, ultima_jogada ASC
      LIMIT 10
    `);

    return res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return res.status(500).json({ error: "Erro ao buscar ranking" });
  }
};

module.exports = { ranking };
