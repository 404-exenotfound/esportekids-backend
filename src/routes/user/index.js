const express = require("express");
const { login } = require("./login");
const { registro } = require("./registro");

const userRouter = () => {
  const router = express.Router();

  router.post("/login", login);
  router.post("/registro", registro);

  return router;
};

module.exports = userRouter;