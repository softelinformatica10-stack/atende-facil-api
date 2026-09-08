import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import customerRouter from "./routes/customer.routes.js";
import orderRouter from "./routes/order.routes.js";
const app = express();

const PORT = 3333;

app.use(express.json());
app.use("/auth", authRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API Atende Fácil funcionando!"
  });
});

app.listen(PORT, () => {
  console.log(`API Atende Fácil rodando em http://localhost:${PORT}`);
});