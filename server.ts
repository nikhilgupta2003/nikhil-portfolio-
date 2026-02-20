import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;
const db = new Database("portfolio.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS resume_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT,
    duration TEXT,
    description TEXT,
    type TEXT -- 'experience' or 'education'
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

app.use(express.json());

// API Routes
app.get("/api/projects", (req, res) => {
  const projects = db.prepare("SELECT * FROM projects").all();
  res.json(projects);
});

app.post("/api/projects", (req, res) => {
  const { title, description, image_url, link, category } = req.body;
  const result = db.prepare(
    "INSERT INTO projects (title, description, image_url, link, category) VALUES (?, ?, ?, ?, ?)"
  ).run(title, description, image_url, link, category);
  res.json({ id: result.lastInsertRowid });
});

app.delete("/api/projects/:id", (req, res) => {
  db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/resume", (req, res) => {
  const resume = db.prepare("SELECT * FROM resume_entries").all();
  res.json(resume);
});

app.post("/api/resume", (req, res) => {
  const { title, company, duration, description, type } = req.body;
  const result = db.prepare(
    "INSERT INTO resume_entries (title, company, duration, description, type) VALUES (?, ?, ?, ?, ?)"
  ).run(title, company, duration, description, type);
  res.json({ id: result.lastInsertRowid });
});

app.delete("/api/resume/:id", (req, res) => {
  db.prepare("DELETE FROM resume_entries WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Simple Admin Auth (In a real app, use better auth)
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  // Default password is 'admin123' for this demo
  if (password === "admin123") {
    res.json({ token: "fake-jwt-token" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
