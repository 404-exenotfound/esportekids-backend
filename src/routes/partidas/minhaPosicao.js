const { db } = require("../../db");

// Posição do usuário logado no ranking geral (mesmo cálculo de /ranking,
// mas sem o LIMIT — assim quem está fora do top 10 também vê onde está).
const minhaPosicao = async (req, res) => {
  try {
    const usuarioId = req.usuario.sub;

    const { rows } = await db.query(
      `-- sql
      WITH totais AS (
        SELECT
          (RANK() OVER (ORDER BY SUM(p.pontuacao) DESC))::int AS posicao,
          u.id,
          u.nome,
          SUM(p.pontuacao)::int       AS pontuacao_total,
          COUNT(p.id)::int            AS partidas,
          SUM(p.acertos)::int         AS acertos,
          SUM(p.total_perguntas)::int AS total_perguntas,
          MAX(p.pontuacao)            AS melhor_partida
        FROM usuarios u
        JOIN partidas p ON p.usuario_id = u.id
        GROUP BY u.id, u.nome
      )
      SELECT
        t.*,
        (SELECT COUNT(*)::int FROM totais) AS total_jogadores
      FROM totais t
      WHERE t.id = $1
      `,
      [usuarioId]
    );

    // Ainda não jogou: devolve zerado em vez de 404
    if (!rows.length) {
      return res.json({
        posicao: null,
        id: usuarioId,
        nome: req.usuario.nome,
        pontuacao_total: 0,
        partidas: 0,
        acertos: 0,
        total_perguntas: 0,
        melhor_partida: 0,
        total_jogadores: null,
      });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar posição no ranking:", error);
    return res.status(500).json({ error: "Erro ao buscar posição no ranking" });
  }
};

module.exports = { minhaPosicao };
