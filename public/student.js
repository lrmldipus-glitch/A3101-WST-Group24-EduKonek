/* My Courses */
/* Course Description scripting */
document.getElementById("CP-course").onclick = 
function() {

    document.getElementById("description-text").textContent =
        "This course introduces students to the fundamental concepts of computer programming, including problem-solving, algorithms, variables, data types, control structures, functions, and basic data structures. Students will develop practical programming skills through hands-on exercises and projects, culminating in a simple working software application.";

    document.getElementById("output-1").textContent =
        "Milestone 1: Programming Fundamentals Portfolio (Deadline: October 1, 2026)";

    document.getElementById("output-2").textContent =
        "Milestone 2: Programming Project Proposal and Prototype (Deadline: October 30, 2026)";

    document.getElementById("output-3").textContent =
        "Terminal Assessment: Final Programming Project (Deadline: November 27, 2026)";

};

document.getElementById("WST-course").onclick = 
function() {

    document.getElementById("description-text").textContent =
        "This course introduces the fundamental concepts, tools, and technologies used in developing modern web systems. It covers web architecture, client- and server-side technologies, databases, APIs, responsive design, web security, and deployment. Through hands-on activities and a culminating project, students will design, develop, test, and deploy a functional web-based application.";

    document.getElementById("output-1").textContent =
        "Milestone 1: Web System Design Proposal (Deadline: October 3, 2026)";

    document.getElementById("output-2").textContent =
        "Milestone 2: Functional Web System Prototype (Deadline: October 29, 2026)";

    document.getElementById("output-3").textContent =
        "Terminal Assessment: Final Web System and Documentation (Deadline: November 29, 2026)";

};

document.getElementById("LWR-course").onclick = 
function() {

    document.getElementById("description-text").textContent =
        "This course examines the life, works, writings, and contributions of Jose Rizal to Philippine history and nation-building. It explores Rizal’s major literary works, ideas, travels, relationships, and historical context, with emphasis on how his writings reflected the social and political conditions of his time and contributed to the development of Filipino national consciousness. Students will critically analyze selected works and relate Rizal’s ideas to contemporary Philippine society.";

    document.getElementById("output-1").textContent =
        "Milestone 1: Rizal Life and Historical Context Porfolio (Deadline: October 2, 2026)";

    document.getElementById("output-2").textContent =
        "Milestone 2: Literary and Hisotrical Analysis (Deadline: October 30, 2026)";

    document.getElementById("output-3").textContent =
        "Terminal Assessment: Rizal and Contemporary Philippine Society Presentation (Deadline: November 25, 2026)";

};

function setBookingMessage(message) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = message;
    row.appendChild(cell);

    var list = document.getElementById("bookings-list");
    list.replaceChildren(row);
}

function loadBookings() {
    var username = sessionStorage.getItem("username");
    var list = document.getElementById("bookings-list");

    document.querySelectorAll(".student-name").forEach(function (element) {
        element.textContent = sessionStorage.getItem("studentName") || username || "Student";
    });

    if (!username) {
        setBookingMessage("Please log in to view your bookings.");
        return;
    }

    fetch("/api/bookings?student=" + encodeURIComponent(username))
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load bookings.");
            }
            return response.json();
        })
        .then(function (bookings) {
            list.replaceChildren();

            if (bookings.length === 0) {
                setBookingMessage("You have no saved bookings yet.");
                return;
            }

            bookings.forEach(function (booking) {
                var row = document.createElement("tr");
                var date = new Date(booking.date + "T00:00:00");
                var values = [
                    booking.course,
                    date.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }),
                    booking.time,
                    booking.instructor,
                    booking.status
                ];

                values.forEach(function (value) {
                    var cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });
                list.appendChild(row);
            });
        })
        .catch(function () {
            setBookingMessage("Could not load bookings. Please try again.");
        });
}

loadBookings();
