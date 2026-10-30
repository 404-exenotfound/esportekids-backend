const { z } = require("zod");
const { db } = require("../../db");

// Resultado já corrigido no cliente (quizzes locais do EsporteKids,
// que não têm perguntas no banco). Grava nas mesmas tabelas de
// /partida, então /historico e /ranking funcionam sem mudança.
const resultadoSchema = z
  .object({
    materia_id: z.number().int().positive(),
    acertos: z.number().int().min(0),
    total_perguntas: z.number().int().positive(),
  })
  .refine((d) => d.acertos <= d.total_perguntas, {
    message: "acertos não pode ser maior que total_perguntas",
    path: ["acertos"],
  });

const salvarResultado = async (req, res) => {
  try {
    const parsed = resultadoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
    }

    const { materia_id, acertos, total_perguntas } = parsed.data;
    const usuarioId = req.usuario.sub;
    const pontuacao = acertos * 10;

    const { rows: materias } = await db.query(
      `-- sql
      SELECT id FROM materias WHERE id = $1`,
      [materia_id]
    );
    if (!materias.length) {
      return res.status(400).json({ error: "Matéria não encontrada" });
    }

    const { rows: partida } = await db.query(
      `-- sql
      INSERT INTO partidas (usuario_id, pontuacao, acertos, total_perguntas)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [usuarioId, pontuacao, acertos, total_perguntas]
    );

    const partidaId = partida[0].id;

    await db.query(
      `-- sql
      INSERT INTO partida_materias (partida_id, materia_id) VALUES ($1, $2)`,
      [partidaId, materia_id]
    );

    return res.status(201).json({
      partida_id: partidaId,
      acertos,
      total_perguntas,
      pontuacao,
    });
  } catch (error) {
    console.error("Erro ao salvar resultado:", error);
    return res.status(500).json({ error: "Erro ao salvar resultado" });
  }
};

module.exports = { salvarResultado };
