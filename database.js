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
/* --- Book a Session (Jabez) --- */
db.exec(`
  CREATE TABLE IF NOT EXISTS mentor_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mentor TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    UNIQUE (mentor, time_slot)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_username TEXT NOT NULL,
    course TEXT NOT NULL,
    mentor TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    concern TEXT,
    status TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE UNIQUE INDEX IF NOT EXISTS one_active_booking_per_slot
    ON bookings (mentor, booking_date, time_slot)
    WHERE status IN ('Pending', 'Confirmed');
`);

const slotCount = db.prepare("SELECT COUNT(*) AS total FROM mentor_availability").get().total;

if (slotCount === 0) {
  const mentors = ["Ms. Susan Abella", "Mr. Miguel Cruz", "Ms. Maria Santos"];
  const times = ["9:00 AM - 9:15 AM", "1:30 PM - 1:45 PM", "8:00 PM - 8:15 PM"];
  const addSlot = db.prepare("INSERT INTO mentor_availability (mentor, time_slot) VALUES (?, ?)");

  for (const mentor of mentors) {
    for (const time of times) {
      addSlot.run(mentor, time);
    }
  }
}
module.exports = db;