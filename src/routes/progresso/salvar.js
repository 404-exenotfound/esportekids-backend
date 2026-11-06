const { z } = require("zod");
const { db } = require("../../db");

// Mesma ordem de fases do front (src/educacional/fases/dicasFases.js)
const JOGOS = ["basquete", "futebol", "atletismo", "pingpong", "boliche"];

const estrelas = z.object({
  quiz: z.number().int().min(0),
  matematica: z.number().int().min(0),
});

const progressoSchema = z.object({
  estrelas: z.partialRecord(z.enum(JOGOS), estrelas),
  curiosidades_lidas: z.array(z.string().max(50)).max(200),
  jogos_liberados: z.array(z.enum(JOGOS)).min(1),
  conquistas: z.array(z.string().max(50)).max(50),
});

// PUT /progresso -> grava (substitui) o progresso do usuário logado
const salvarProgresso = async (req, res) => {
  try {
    const parsed = progressoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
    }

    const { estrelas, curiosidades_lidas, jogos_liberados, conquistas } = parsed.data;
    const usuarioId = req.usuario.sub;

    const { rows } = await db.query(
      `-- sql
      INSERT INTO progresso (usuario_id, estrelas, curiosidades_lidas, jogos_liberados, conquistas, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (usuario_id) DO UPDATE SET
        estrelas           = EXCLUDED.estrelas,
        curiosidades_lidas = EXCLUDED.curiosidades_lidas,
        jogos_liberados    = EXCLUDED.jogos_liberados,
        conquistas         = EXCLUDED.conquistas,
        updated_at         = CURRENT_TIMESTAMP
      RETURNING estrelas, curiosidades_lidas, jogos_liberados, conquistas, updated_at`,
      [usuarioId, JSON.stringify(estrelas), curiosidades_lidas, jogos_liberados, conquistas]
    );

    return res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
    return res.status(500).json({ error: "Erro ao salvar progresso" });
  }
};

module.exports = { salvarProgresso, progressoSchema, JOGOS };
