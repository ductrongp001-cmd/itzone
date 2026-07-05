import { getDb } from "./database";

export async function initSchema() {
  const db = await getDb();

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
    description TEXT, cert TEXT NOT NULL, icon TEXT, order_index INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER NOT NULL,
    title TEXT NOT NULL, content TEXT NOT NULL, order_index INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id INTEGER,
    category_id INTEGER NOT NULL, question TEXT NOT NULL,
    options TEXT, correct_answer TEXT NOT NULL, explanation TEXT,
    difficulty TEXT DEFAULT 'beginner',
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);
}
