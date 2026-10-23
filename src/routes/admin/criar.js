const { z } = require("zod");
const { db } = require("../../db");

const alternativaSchema = z.object({
  texto:  z.string().min(1, "Texto da alternativa obrigatório"),
  correta: z.boolean(),
});

const criarSchema = z.object({
  materia_id: z.number().int().positive("materia_id inválido"),
  enunciado:  z.string().min(3, "Enunciado muito curto"),
  alternativas: z
    .array(alternativaSchema)
    .min(2, "Mínimo 2 alternativas")
    .refine(
      (alts) => alts.filter((a) => a.correta).length === 1,
      "Exatamente 1 alternativa deve ser marcada como correta"
    ),
});

const criarPergunta = async (req, res) => {
  try {
    const parsed = criarSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
    }

    const { materia_id, enunciado, alternativas } = parsed.data;

    // Verifica se matéria existe
    const { rows: materias } = await db.query(
      `SELECT id FROM materias WHERE id = $1`,
      [materia_id]
    );
    if (!materias.length) {
      return res.status(400).json({ error: "Matéria não encontrada" });
    }

    // Insere pergunta
    const { rows: perguntaRows } = await db.query(
      `-- sql
      INSERT INTO perguntas (materia_id, enunciado) VALUES ($1, $2) RETURNING id`,
      [materia_id, enunciado]
    );
    const perguntaId = perguntaRows[0].id;

    // Insere alternativas
    for (const alt of alternativas) {
      await db.query(
        `-- sql
        INSERT INTO alternativas (pergunta_id, texto, correta) VALUES ($1, $2, $3)`,
        [perguntaId, alt.texto, alt.correta]
      );
    }

    return res.status(201).json({ id: perguntaId, message: "Pergunta criada com sucesso" });
  } catch (error) {
    console.error("Erro ao criar pergunta:", error);
    return res.status(500).json({ error: "Erro ao criar pergunta" });
  }
};

module.exports = { criarPergunta };
