const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    name: "Backend Medidor de pH",
    message: "Servidor funcionando correctamente.",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Backend Medidor de pH activo en http://localhost:${PORT}`);
});
