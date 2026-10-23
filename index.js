require("dotenv").config();
const express = require("express");
const userRouter = require("./src/routes/user");
const materiasRouter = require("./src/routes/materias");
const quizRouter = require("./src/routes/quiz");
const partidasRouter = require("./src/routes/partidas");
const adminRouter = require("./src/routes/admin");

const app = express();
app.use(express.json());
app.use(require("cors")({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "API rodando" });
});

app.use("/", userRouter());
app.use("/", materiasRouter());
app.use("/", quizRouter());
app.use("/", partidasRouter());
app.use("/", adminRouter());

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
