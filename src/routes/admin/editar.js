const { z } = require("zod");
const { db } = require("../../db");

const alternativaSchema = z.object({
  texto:   z.string().min(1, "Texto da alternativa obrigatório"),
  correta: z.boolean(),
});

const editarSchema = z.object({
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

const editarPergunta = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const parsed = editarSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
    }

    const { materia_id, enunciado, alternativas } = parsed.data;

    // Verifica se pergunta existe
    const { rows: existentes } = await db.query(
      `SELECT id FROM perguntas WHERE id = $1`,
      [id]
    );
    if (!existentes.length) {
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    // Atualiza enunciado e matéria
    await db.query(
      `-- sql
      UPDATE perguntas SET materia_id = $1, enunciado = $2 WHERE id = $3`,
      [materia_id, enunciado, id]
    );

    // Remove alternativas antigas e insere as novas
    await db.query(`DELETE FROM alternativas WHERE pergunta_id = $1`, [id]);

    for (const alt of alternativas) {
      await db.query(
        `-- sql
        INSERT INTO alternativas (pergunta_id, texto, correta) VALUES ($1, $2, $3)`,
        [id, alt.texto, alt.correta]
      );
    }

    return res.json({ message: "Pergunta atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao editar pergunta:", error);
    return res.status(500).json({ error: "Erro ao editar pergunta" });
  }
};

module.exports = { editarPergunta };
