const { db } = require("../../db");

const deletarPergunta = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    // Verifica se pergunta existe
    const { rows } = await db.query(
      `SELECT id FROM perguntas WHERE id = $1`,
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    // Deleta (alternativas são deletadas em cascade)
    await db.query(`DELETE FROM perguntas WHERE id = $1`, [id]);

    return res.json({ message: "Pergunta deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pergunta:", error);
    return res.status(500).json({ error: "Erro ao deletar pergunta" });
  }
};

module.exports = { deletarPergunta };
