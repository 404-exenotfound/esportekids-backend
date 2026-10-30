const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../../db");
const { NOMES, buscarUsados, proximoNome } = require("./nomes");

// "nome" é a BASE escolhida na lista (ex.: "Pedro"). O nome final
// (Pedro, Pedro2...) é decidido aqui, para dois cadastros ao mesmo
// tempo não ficarem com o mesmo nome.
const registroSchema = z.object({
  nome: z.enum(NOMES, "Escolha um nome da lista"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// Código do PostgreSQL para violação de UNIQUE
const NOME_DUPLICADO = "23505";

const registro = async (req, res) => {
    try {
      const parsed = registroSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: parsed.error.flatten(),
        });
      }

      const { nome: base, senha } = parsed.data;

      // Hash da senha
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

      // Se outra pessoa pegar o mesmo nome entre o SELECT e o INSERT,
      // o UNIQUE de usuarios.nome barra e tenta o número seguinte.
      let usuario = null;
      for (let tentativa = 0; tentativa < 3 && !usuario; tentativa++) {
        const nome = proximoNome(base, await buscarUsados([base]));
        try {
          const { rows } = await db.query(
            `-- sql
            INSERT INTO usuarios (nome, senha)
            VALUES ($1, $2)
            RETURNING id, nome, cargo`,
            [nome, senhaHash]
          );
          usuario = rows[0];
        } catch (error) {
          if (error.code !== NOME_DUPLICADO) throw error;
        }
      }

      if (!usuario) {
        return res.status(409).json({
          error: "Esse nome acabou de ser escolhido, tente de novo",
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

      return res.status(201).json({
        message: "Usuário registrado com sucesso",
        token,
        usuario,
      });
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return res.status(500).json({
        error: "Erro ao processar registro",
      });
    }
  };

module.exports = { registro, registroSchema };
