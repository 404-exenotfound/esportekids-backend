const express = require("express");
const { auth } = require("../../middleware/auth");
const { buscarProgresso } = require("./buscar");
const { salvarProgresso } = require("./salvar");

const progressoRouter = () => {
  const router = express.Router();

  router.get("/progresso", auth, buscarProgresso);
  router.put("/progresso", auth, salvarProgresso);

  return router;
};

module.exports = progressoRouter;
