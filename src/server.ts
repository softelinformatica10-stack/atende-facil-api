import "dotenv/config";
import express from "express";

const app = express();

const PORT = 3333;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API Atende Fácil funcionando!"
  });
});

app.listen(PORT, () => {
  console.log(`API Atende Fácil rodando em http://localhost:${PORT}`);
});