const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../../db");

const loginSchema = z.object({
  email: z.email("Email invalido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// curl -X POST -H "Content-Type: application/json" -d '{"email": "joaobilheiro@outlook.com", "senha": "123456"}' http://localhost:3000/login
const login = async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: parsed.error.flatten(),
        });
      }

      const { email, senha } = parsed.data;

      const { rows } = await db.query(`-- sql
        SELECT
          id,
          nome,
          email,
          senha,
          cargo
        FROM usuarios
        WHERE
          email = $1
      `, [email]);

      if (!rows.length) {
        return res.status(401).json({ 
          error: "Credenciais inválidas" 
        });
      }

      const usuario = rows[0];

      // Comparar senha com hash
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ 
          error: "Credenciais inválidas" 
        });
      }

      const token = jwt.sign(
        {
          sub: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          cargo: usuario.cargo,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login realizado com sucesso",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          cargo: usuario.cargo,
        },
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ 
        error: "Erro ao processar login" 
      });
    }
  };

module.exports = { login, loginSchema };

