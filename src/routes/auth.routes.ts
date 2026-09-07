import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const authRouter = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "atende-facil-secret";

authRouter.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Nome, telefone e senha são obrigatórios."
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Usuário já cadastrado."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        passwordHash
      }
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar usuário."
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Telefone e senha são obrigatórios."
      });
    }

    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      return res.status(401).json({
        message: "Telefone ou senha inválidos."
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Telefone ou senha inválidos."
      });
    }

    const token = jwt.sign(
      {
        userId: user.id
      },
      JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.json({
      message: "Login realizado com sucesso.",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao realizar login."
    });
  }
});

export default authRouter;