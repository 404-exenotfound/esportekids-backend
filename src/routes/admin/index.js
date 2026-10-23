const express = require("express");
const { adminAuth } = require("../../middleware/adminAuth");
const { listarPerguntas } = require("./listar");
const { criarPergunta } = require("./criar");
const { editarPergunta } = require("./editar");
const { deletarPergunta } = require("./deletar");

const adminRouter = () => {
  const router = express.Router();

  router.get("/admin/perguntas", adminAuth, listarPerguntas);
  router.post("/admin/perguntas", adminAuth, criarPergunta);
  router.put("/admin/perguntas/:id", adminAuth, editarPergunta);
  router.delete("/admin/perguntas/:id", adminAuth, deletarPergunta);

  return router;
};

module.exports = adminRouter;
