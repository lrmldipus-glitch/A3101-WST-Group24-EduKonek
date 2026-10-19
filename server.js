const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./database");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }


  const match = bcrypt.compareSync(password, user.password_hash);

  if (!match) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  res.json({ role: user.role });
});

app.post("/signup", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const course = req.body.course;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;
  const studentId = req.body.studentId;
  const gender = req.body.gender;

  if (!firstName || !lastName || !username || !password || !email || !studentId) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  if (username.length < 4) {
    return res.status(400).json({ message: "Username must be at least 4 characters." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const firstPart = studentId.slice(0, 4);
  const lastPart = studentId.slice(5);

  if (studentId.length !== 9 || studentId[4] !== "-" || isNaN(firstPart) || isNaN(lastPart)) {
    return res.status(400).json({ message: "Student ID format should be xxxx-xxxx." });
  }

  /*for verification lang */
  const taken = db.prepare("SELECT username, student_id FROM users WHERE username = ? OR student_id = ? OR email = ?")
    .get(username, studentId, email);

  if (taken) {
    if (taken.username.toLowerCase() === username.toLowerCase()) {
      return res.status(409).json({ message: "That username is already taken." });
    }
    if (taken.student_id === studentId) {
      return res.status(409).json({ message: "That Student ID is already registered." });
    }
    return res.status(409).json({ message: "That email is already registered." });
  }


  const hash = bcrypt.hashSync(password, 10);

  db.prepare("INSERT INTO users (username, password_hash, role, first_name, last_name, email, phone, course, gender, student_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(username, hash, "student", firstName, lastName, email, phone, course, gender, studentId);

  res.json({ message: "Account created!" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});