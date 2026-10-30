const express = require("express");
const { login } = require("./login");
const { registro } = require("./registro");
const { listarNomes } = require("./nomes");

const userRouter = () => {
  const router = express.Router();

  router.post("/login", login);
  router.post("/registro", registro);
  router.get("/nomes", listarNomes);

  return router;
};

module.exports = userRouter;
