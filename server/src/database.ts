import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(__dirname, "..", "data", "itzone.db");

let db: SqlJsDatabase | null = null;
let initPromise: Promise<void> | null = null;

export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;
  if (initPromise) { await initPromise; return db!; }
  initPromise = (async () => {
    const SQL = await initSqlJs();
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(DB_PATH)) {
      db = new SQL.Database(fs.readFileSync(DB_PATH));
    } else {
      db = new SQL.Database();
    }
    setInterval(() => saveDb(), 30000);
  })();
  await initPromise;
  return db!;
}

export function saveDb() {
  if (!db) return;
  try {
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  } catch {}
}
