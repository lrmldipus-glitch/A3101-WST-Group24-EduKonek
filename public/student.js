// Course Description 

// Gets the HTML elements for each course box
const comProg = document.getElementById("CP-course");
const webSysT = document.getElementById("WST-course");
const lifeWorksR = document.getElementById("LWR-course");

// When a course box is clicked, call showCourse() and pass the corresponding course name to the function.
comProg.onclick = () => {
    showCourse("CP");
};

webSysT.onclick = () => {
    showCourse("WST");
};

lifeWorksR.onclick = () => {
    showCourse("LWR");
};

// showCourse Function 
// courseName is passed into the URL as a query parameter. Express receives it using req.query.name.

async function showCourse(courseName) {
    // Requests the course data from the Express backend.
    const response = await fetch(`/courses?name=${courseName}`);

    // Reads the response body and converts its JSON into a JavaScript object.
    const course = await response.json();

    //Checks whether the HTTP response was successful 
    if (!response.ok) {
        document.getElementById("description-text").textContent =
            course.error;
        return;
    }

    // Displays the course data received from the backend   
    document.getElementById("description-text").textContent =
        course.description;

    document.getElementById("output-1").textContent =
        course.MS1;

    document.getElementById("output-2").textContent =
        course.MS2;

    document.getElementById("output-3").textContent =
        course.TA;
}

const bookingsTableBody = document.getElementById("bookings-table-body");

function displayStudentUsername() {
    const username = sessionStorage.getItem("username") || "Student";
    document.getElementById("student-username").textContent = username;
    document.getElementById("welcome-username").textContent = username;
    document.getElementById("student-avatar").textContent =
        sessionStorage.getItem("initials") || username.slice(0, 2).toUpperCase();
}

function displayBookingMessage(message) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = message;
    row.appendChild(cell);
    bookingsTableBody.replaceChildren(row);
}

async function loadStudentBookings() {
    const username = sessionStorage.getItem("username");

    if (!username) {
        displayBookingMessage("Please sign in to view your bookings.");
        return;
    }

    try {
        const response = await fetch(`/api/bookings?student=${encodeURIComponent(username)}`);
        const bookings = await response.json();

        if (!response.ok) {
            throw new Error(bookings.message || "Could not load your bookings.");
        }

        if (bookings.length === 0) {
            displayBookingMessage("You don't have any bookings yet.");
            return;
        }

        bookingsTableBody.replaceChildren();
        bookings.forEach((booking) => {
            const row = document.createElement("tr");
            const date = new Date(`${booking.date}T00:00:00`);
            const values = [
                booking.course,
                date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
                booking.time,
                booking.instructor,
                booking.status
            ];

            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            bookingsTableBody.appendChild(row);
        });
    } catch (error) {
        displayBookingMessage(error.message || "Could not load your bookings.");
    }
}

displayStudentUsername();
loadStudentBookings();
