const express = require("express");
const { db } = require("../../db");
const { auth } = require("../../middleware/auth");

const quizRouter = () => {
  const router = express.Router();

  router.get("/quiz", auth, async (req, res) => {
    try {
      const { materias } = req.query;

      if (!materias) {
        return res.status(400).json({ error: "Informe ao menos uma matéria" });
      }

      const ids = String(materias)
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n) && n > 0);

      if (!ids.length) {
        return res.status(400).json({ error: "IDs de matérias inválidos" });
      }

      const { rows } = await db.query(
        `-- sql
        SELECT
          p.id,
          p.enunciado,
          m.nome AS materia,
          json_agg(
            json_build_object('id', a.id, 'texto', a.texto)
            ORDER BY random()
          ) AS alternativas
        FROM perguntas p
        JOIN materias m ON m.id = p.materia_id
        JOIN alternativas a ON a.pergunta_id = p.id
        WHERE p.materia_id = ANY($1::int[])
        GROUP BY p.id, m.nome
        ORDER BY random()
        LIMIT 10
        `,
        [ids]
      );

      return res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar quiz:", error);
      return res.status(500).json({ error: "Erro ao buscar perguntas" });
    }
  });

  return router;
};

module.exports = quizRouter;
