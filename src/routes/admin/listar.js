const { db } = require("../../db");

const listarPerguntas = async (_req, res) => {
  try {
    const { rows } = await db.query(`-- sql
      SELECT
        p.id,
        p.materia_id,
        m.nome AS materia,
        p.enunciado,
        json_agg(
          json_build_object(
            'id',      a.id,
            'texto',   a.texto,
            'correta', a.correta
          ) ORDER BY a.id
        ) AS alternativas
      FROM perguntas p
      JOIN materias m ON m.id = p.materia_id
      JOIN alternativas a ON a.pergunta_id = p.id
      GROUP BY p.id, p.materia_id, m.nome, p.enunciado
      ORDER BY p.id
    `);

    return res.json(rows);
  } catch (error) {
    console.error("Erro ao listar perguntas:", error);
    return res.status(500).json({ error: "Erro ao listar perguntas" });
  }
};

module.exports = { listarPerguntas };
