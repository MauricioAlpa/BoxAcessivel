import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT ?? 3000;
const NODE_ENV = process.env.NODE_ENV ?? "development";

app.use(cors());
app.use(express.json());
app.set('trust proxy', true);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

app.use(routes);

app.listen(PORT, "0.0.0.0", () => {
  if (NODE_ENV === "development") {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  } else {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  }
});

export default app;