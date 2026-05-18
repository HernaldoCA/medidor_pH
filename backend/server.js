const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, "data", "experiments.json");

app.use(cors());
app.use(express.json());

async function readDb() {
  const raw = await fs.readFile(DB_PATH, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data.experiments) ? data.experiments : [];
}

async function writeDb(experiments) {
  await fs.writeFile(
    DB_PATH,
    JSON.stringify({ experiments }, null, 2),
    "utf8"
  );
}

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

app.get("/api/experiments", async (_req, res) => {
  try {
    const experiments = await readDb();
    res.json(experiments);
  } catch (error) {
    res.status(500).json({ error: "No se pudo leer los experimentos." });
  }
});

app.post("/api/experiments", async (req, res) => {
  try {
    const {
      substance,
      indicatorId,
      indicatorName,
      phValue,
      colorName,
      classification,
      explanation,
    } = req.body;

    if (!substance || !indicatorId) {
      return res.status(400).json({ error: "Faltan datos del experimento." });
    }

    const experiments = await readDb();
    const experiment = {
      id: `exp-${Date.now()}`,
      substance: String(substance).trim(),
      indicatorId,
      indicatorName: indicatorName || "",
      phValue: Number(phValue) || 7,
      colorName: colorName || "",
      classification: classification || "neutra",
      explanation: explanation || "",
      createdAt: new Date().toISOString(),
    };

    const next = [experiment, ...experiments];
    await writeDb(next);
    res.status(201).json(experiment);
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar el experimento." });
  }
});

app.delete("/api/experiments/:id", async (req, res) => {
  try {
    const experiments = await readDb();
    const next = experiments.filter((item) => item.id !== req.params.id);

    if (next.length === experiments.length) {
      return res.status(404).json({ error: "Experimento no encontrado." });
    }

    await writeDb(next);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el experimento." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Medidor de pH activo en http://localhost:${PORT}`);
});
