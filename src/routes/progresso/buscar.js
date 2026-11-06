const { db } = require("../../db");

// GET /progresso -> progresso salvo do usuário logado, ou null se ele
// ainda não salvou nada (o front então sobe o que tem no navegador).
const buscarProgresso = async (req, res) => {
  try {
    const usuarioId = req.usuario.sub;

    const { rows } = await db.query(
      `-- sql
      SELECT estrelas, curiosidades_lidas, jogos_liberados, conquistas, updated_at
      FROM progresso
      WHERE usuario_id = $1`,
      [usuarioId]
    );

    return res.json(rows[0] ?? null);
  } catch (error) {
    console.error("Erro ao buscar progresso:", error);
    return res.status(500).json({ error: "Erro ao buscar progresso" });
  }
};

module.exports = { buscarProgresso };
