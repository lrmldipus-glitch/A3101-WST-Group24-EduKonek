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

/* --- Book a Session (Jabez) --- */

/* GET /api/slots?mentor=...&date=YYYY-MM-DD */
app.get("/api/slots", (req, res) => {
  const mentor = req.query.mentor;
  const date = req.query.date;

  if (!mentor || !date) {
    return res.status(400).json({ message: "Mentor and date are required." });
  }

  const slots = db.prepare("SELECT time_slot FROM mentor_availability WHERE mentor = ? ORDER BY id").all(mentor);

  const taken = db.prepare("SELECT time_slot FROM bookings WHERE mentor = ? AND booking_date = ? AND status IN ('Pending', 'Confirmed')")
    .all(mentor, date)
    .map(function (row) { return row.time_slot; });

  res.json(slots.map(function (slot) {
    return {
      time: slot.time_slot,
      status: taken.includes(slot.time_slot) ? "Booked" : "Available"
    };
  }));
});

/* POST /api/bookings  (status: "Draft" or "Pending") */
app.post("/api/bookings", (req, res) => {
  const student = req.body.student || "student";
  const course = req.body.course;
  const mentor = req.body.mentor;
  const date = req.body.date;
  const timeSlot = req.body.timeSlot;
  const concern = req.body.concern || "";
  const status = req.body.status;

  if (!course || !mentor || !date || !timeSlot) {
    return res.status(400).json({ message: "Please choose a course, date and time slot." });
  }

  if (status !== "Draft" && status !== "Pending") {
    return res.status(400).json({ message: "Invalid booking status." });
  }

  const validSlot = db.prepare("SELECT id FROM mentor_availability WHERE mentor = ? AND time_slot = ?").get(mentor, timeSlot);

  if (!validSlot) {
    return res.status(400).json({ message: "That time slot does not exist for this mentor." });
  }

  /* only a real booking (Pending) needs the slot to be free */
  if (status === "Pending") {
    const taken = db.prepare("SELECT id FROM bookings WHERE mentor = ? AND booking_date = ? AND time_slot = ? AND status IN ('Pending', 'Confirmed')")
      .get(mentor, date, timeSlot);

    if (taken) {
      return res.status(409).json({ message: "Sorry, that slot was just booked. Please pick another." });
    }
  }

  db.prepare("INSERT INTO bookings (student_username, course, mentor, booking_date, time_slot, concern, status) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(student, course, mentor, date, timeSlot, concern, status);

  res.json({
    message: status === "Draft" ? "Draft saved." : "Booking submitted! Waiting for mentor confirmation."
  });
});

/* GET /api/bookings?student=username  (for "My Bookings") */
app.get("/api/bookings", (req, res) => {
  const student = req.query.student;

  if (!student) {
    return res.status(400).json({ message: "Student is required." });
  }

  const rows = db.prepare("SELECT id, course, booking_date AS date, time_slot AS time, mentor AS instructor, status FROM bookings WHERE student_username = ? ORDER BY booking_date, id")
    .all(student);

  res.json(rows);
});

// Course Description : course container
const courses = {
  CP: {

    description: "This course introduces students to the fundamental concepts of computer programming, including problem-solving, algorithms, variables, data types, control structures, functions, and basic data structures. Students will develop practical programming skills through hands-on exercises and projects, culminating in a simple working software application.",
    MS1: "Milestone 1: Programming Fundamentals Portfolio (Deadline: October 1, 2026)",
    MS2: "Milestone 2: Programming Project Proposal and Prototype (Deadline: October 30, 2026)",
    TA: "Terminal Assessment: Final Programming Project (Deadline: November 27, 2026)" 

  },

  WST: {

    description: "This course introduces the fundamental concepts, tools, and technologies used in developing modern web systems. It covers web architecture, client- and server-side technologies, databases, APIs, responsive design, web security, and deployment. Through hands-on activities and a culminating project, students will design, develop, test, and deploy a functional web-based application.",
    MS1: "Milestone 1: Web System Design Proposal (Deadline: October 3, 2026)",
    MS2: "Milestone 2: Functional Web System Prototype (Deadline: October 29, 2026)",
    TA: "Terminal Assessment: Final Web System and Documentation (Deadline: November 29, 2026)"   

  },

  LWR: {

    description: "This course examines the life, works, writings, and contributions of Jose Rizal to Philippine history and nation-building. It explores Rizal’s major literary works, ideas, travels, relationships, and historical context, with emphasis on how his writings reflected the social and political conditions of his time and contributed to the development of Filipino national consciousness. Students will critically analyze selected works and relate Rizal’s ideas to contemporary Philippine society.",
    MS1: "Milestone 1: Rizal Life and Historical Context Porfolio (Deadline: October 2, 2026)",
    MS2: "Milestone 2: Literary and Hisotrical Analysis (Deadline: October 30, 2026)",
    TA: "Terminal Assessment: Rizal and Contemporary Philippine Society Presentation (Deadline: November 25, 2026)" 

  }
};

// Course Description: course description selector backend
app.get('/courses', (req,res) => {
  const courseName = req.query.name;
  const course = courses[courseName];

  if(!course){
    return res.status(404).json({
      error: "Courses not found"
    })
  }
  res.json(course);

});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
