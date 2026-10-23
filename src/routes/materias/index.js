const express = require("express");
const { db } = require("../../db");

const materiasRouter = () => {
  const router = express.Router();

  router.get("/materias", async (_req, res) => {
    try {
      const { rows } = await db.query(`-- sql
        SELECT id, nome, icone FROM materias ORDER BY id
      `);
      return res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar matérias:", error);
      return res.status(500).json({ error: "Erro ao buscar matérias" });
    }
  });

  return router;
};

module.exports = materiasRouter;
