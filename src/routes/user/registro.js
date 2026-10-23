const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../../db");

const registroSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  email: z.email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const registro = async (req, res) => {
    try {
      const parsed = registroSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: parsed.error.flatten(),
        });
      }

      const { nome, email, senha } = parsed.data;

      // Verificar se email já existe
      const { rows: usuariosExistentes } = await db.query(
        `-- sql
        SELECT id FROM usuarios WHERE email = $1`,
        [email]
      );

      if (usuariosExistentes.length > 0) {
        return res.status(409).json({
          error: "Email já cadastrado",
        });
      }

      // Hash da senha
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

      // Inserir novo usuário
      const { rows: usuariosInseridos } = await db.query(
        `-- sql
        INSERT INTO usuarios (nome, email, senha) 
        VALUES ($1, $2, $3)
        RETURNING id`,
        [nome, email, senhaHash]
      );

      const novoUsuarioid = usuariosInseridos[0].id;

      const token = jwt.sign(
        {
          sub: novoUsuarioid,
          nome: nome,
          email: email,
          cargo: "cliente",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(201).json({
        message: "Usuário registrado com sucesso",
        token,
        usuario: {
          id: novoUsuarioid,
          nome: nome,
          email: email,
          cargo: "cliente",
        },
      });
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return res.status(500).json({
        error: "Erro ao processar registro",
      });
    }
  };

module.exports = { registro, registroSchema };
