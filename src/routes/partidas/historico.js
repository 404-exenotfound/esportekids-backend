const { db } = require("../../db");

const historico = async (req, res) => {
  try {
    const usuarioId = req.usuario.sub;

    const { rows } = await db.query(
      `-- sql
      SELECT
        p.id,
        p.pontuacao,
        p.acertos,
        p.total_perguntas,
        p.created_at,
        array_agg(m.nome ORDER BY m.nome) AS materias
      FROM partidas p
      JOIN partida_materias pm ON pm.partida_id = p.id
      JOIN materias m ON m.id = pm.materia_id
      WHERE p.usuario_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 20
      `,
      [usuarioId]
    );

    return res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return res.status(500).json({ error: "Erro ao buscar histórico" });
  }
};

module.exports = { historico };
