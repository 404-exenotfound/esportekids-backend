const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../../db");

const loginSchema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// curl -X POST -H "Content-Type: application/json" -d '{"nome": "Pedro2", "senha": "123456"}' http://localhost:3000/login
const login = async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: parsed.error.flatten(),
        });
      }

      const { nome, senha } = parsed.data;

      // Sem diferenciar maiúscula/minúscula: "pedro2" entra como "Pedro2"
      const { rows } = await db.query(`-- sql
        SELECT
          id,
          nome,
          senha,
          cargo
        FROM usuarios
        WHERE
          LOWER(nome) = LOWER($1)
      `, [nome]);

      if (!rows.length) {
        return res.status(401).json({
          error: "Nome ou senha incorretos"
        });
      }

      const usuario = rows[0];

      // Comparar senha com hash
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({
          error: "Nome ou senha incorretos"
        });
      }

      const token = jwt.sign(
        {
          sub: usuario.id,
          nome: usuario.nome,
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
