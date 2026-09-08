import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const customerRouter = Router();
const prisma = new PrismaClient();

customerRouter.get("/", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return res.json(customers);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao consultar clientes."
    });
  }
});
customerRouter.post("/", async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Nome e telefone são obrigatórios."
      });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email
      }
    });

    return res.status(201).json(customer);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar cliente."
    });
  }
});

export default customerRouter;