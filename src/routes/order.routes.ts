import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const orderRouter = Router();
const prisma = new PrismaClient();

orderRouter.patch("/:id/status", async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const validStatuses = [
      "PENDENTE",
      "EM_ANDAMENTO",
      "CONCLUIDO"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status inválido."
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado."
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: status as "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO"
      },
      include: {
        customer: true
      }
    });

    return res.json(updatedOrder);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar status do pedido."
    });
  }
});
orderRouter.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        customer: true
      }
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao consultar pedidos."
    });
  }
});
orderRouter.post("/", async (req, res) => {
  try {
    const { subject, customerId, userId } = req.body;

    if (!subject || !customerId) {
      return res.status(400).json({
        message: "Assunto e cliente são obrigatórios."
      });
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(customerId)
      }
    });

    if (!customer) {
      return res.status(404).json({
        message: "Cliente não encontrado."
      });
    }

    const order = await prisma.order.create({
      data: {
        subject,
        customerId: Number(customerId),
        userId: userId ? Number(userId) : null
      },
      include: {
        customer: true
      }
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar pedido."
    });
  }
});

export default orderRouter;