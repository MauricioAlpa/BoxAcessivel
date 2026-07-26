import app from './src/app.js';
import 'dotenv/config';

const PORT = process.env.PORT ?? 3000;
const NODE_ENV = process.env.NODE_ENV ?? "development";

app.listen(PORT, "0.0.0.0", () => {
  if (NODE_ENV === "development") {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  } else {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  }
});