import express from "express";
import cors from "cors";
import path from "path";
import { getDb, saveDb } from "./database";
import { initSchema } from "./schema";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";

const app = express();
const PORT = parseInt(process.env.PORT || "3002");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", apiRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const clientDist = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

async function start() {
  await initSchema();
  // Auto-seed if database is empty
  const db = await getDb();
  const cats = db.exec("SELECT COUNT(*) as c FROM categories");
  if (!cats[0]?.values[0]?.[0]) {
    const { runSeed } = await import("./seed");
    await runSeed();
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ITZone running on http://localhost:${PORT} (LAN: http://192.168.1.x:${PORT})`);
  });
}

start();
