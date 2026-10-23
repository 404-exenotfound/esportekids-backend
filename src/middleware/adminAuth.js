const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token obrigatório" });

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    if (req.usuario.cargo !== "adm") {
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = { adminAuth };
