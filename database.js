const { DatabaseSync } = require("node:sqlite");
const bcrypt = require("bcryptjs");

const db = new DatabaseSync("edukonek.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    course TEXT,
    gender TEXT,
    student_id TEXT UNIQUE
  )
`);

const count = db.prepare("SELECT COUNT(*) AS total FROM users").get().total;

if (count === 0) {
  const add = db.prepare("INSERT INTO users (username, password_hash, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)");
  add.run("Mentor", bcrypt.hashSync("12345", 10), "mentor", "Susan", "Abella"); /*Test account lang for mentor*/ 
}

module.exports = db;