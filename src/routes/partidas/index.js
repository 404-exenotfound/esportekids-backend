const express = require("express");
const { auth } = require("../../middleware/auth");
const { salvarPartida } = require("./salvar");
const { historico } = require("./historico");
const { ranking } = require("./ranking");
const { salvarResultado } = require("./resultado");

const partidasRouter = () => {
  const router = express.Router();

  router.post("/partida", auth, salvarPartida);
  router.post("/partida/resultado", auth, salvarResultado);
  router.get("/historico", auth, historico);
  router.get("/ranking",auth, ranking);

  return router;
};

module.exports = partidasRouter;
