const { z } = require("zod");
const { db } = require("../../db");

const salvarSchema = z.object({
  materias: z.array(z.number().int().positive()).min(1),
  respostas: z
    .array(
      z.object({
        pergunta_id: z.number().int().positive(),
        alternativa_id: z.number().int().positive(),
      })
    )
    .min(1),
});

const salvarPartida = async (req, res) => {
  try {
    const parsed = salvarSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
    }

    const { materias, respostas } = parsed.data;
    const usuarioId = req.usuario.sub;

    // Buscar alternativas corretas das perguntas enviadas
    const perguntaIds = respostas.map((r) => r.pergunta_id);
    const { rows: corretas } = await db.query(
      `-- sql
      SELECT pergunta_id, id AS alternativa_id
      FROM alternativas
      WHERE pergunta_id = ANY($1::int[]) AND correta = true
      `,
      [perguntaIds]
    );

    const mapaCorretas = new Map(corretas.map((c) => [c.pergunta_id, c.alternativa_id]));

    let acertos = 0;
    for (const r of respostas) {
      if (mapaCorretas.get(r.pergunta_id) === r.alternativa_id) acertos++;
    }

    const totalPerguntas = respostas.length;
    const pontuacao = acertos * 10;

    // Salvar partida
    const { rows: partida } = await db.query(
      `-- sql
      INSERT INTO partidas (usuario_id, pontuacao, acertos, total_perguntas)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [usuarioId, pontuacao, acertos, totalPerguntas]
    );

    const partidaId = partida[0].id;

    // Salvar matérias da partida
    for (const materiaId of materias) {
      await db.query(
        `INSERT INTO partida_materias (partida_id, materia_id) VALUES ($1, $2)`,
        [partidaId, materiaId]
      );
    }

    return res.status(201).json({
      partida_id: partidaId,
      acertos,
      total_perguntas: totalPerguntas,
      pontuacao,
    });
  } catch (error) {
    console.error("Erro ao salvar partida:", error);
    return res.status(500).json({ error: "Erro ao salvar partida" });
  }
};

module.exports = { salvarPartida };
