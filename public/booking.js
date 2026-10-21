/* --- Jabez Anthony: Booking & Available Schedules Script --- */

var selectedSlot = null;

/* Who is logged in? Falls back to "student" until login saves the username. */
function getStudent() {
    return sessionStorage.getItem("username") || "";
}

function todayString() {
    var d = new Date();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + month + "-" + day;
}

window.updateMentorName = function() {
    const courseSelect = document.getElementById("course-select");
    const mentorField = document.getElementById("mentor-field");

    const selectedCourse = courseSelect.value;

    if (selectedCourse === "Computer Programming") {
        mentorField.value = "Ms. Susan Abella";
    } else if (selectedCourse === "Web Systems and Technology") {
        mentorField.value = "Mr. Miguel Cruz";
    } else if (selectedCourse === "Life and Works of Rizal") {
        mentorField.value = "Ms. Maria Santos";
    }

    loadSlots();
};

function loadSlots() {
    var mentor = document.getElementById("mentor-field").value;
    var date = document.getElementById("booking-date").value;
    var container = document.querySelector(".schedule-container");

    selectedSlot = null;

    if (!date) {
        container.innerHTML = "";
        return;
    }

    fetch("/api/slots?mentor=" + encodeURIComponent(mentor) + "&date=" + encodeURIComponent(date))
        .then(function (response) {
            return response.json();
        })
        .then(function (slots) {
            renderSlots(slots, container);
        })
        .catch(function () {
            container.textContent = "Could not load schedules. Is the server running?";
        });
}
function renderSlots(slots, container) {
    container.innerHTML = "";

    slots.forEach(function (slot) {
        var isBooked = slot.status === "Booked";

        var row = document.createElement("div");
        row.className = "schedule-row " + (isBooked ? "booked" : "available");

        var label = document.createElement("label");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.disabled = isBooked;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + slot.time));

        var status = document.createElement("span");
        status.className = "status-text";
        status.textContent = slot.status;

        row.appendChild(label);
        row.appendChild(status);
        container.appendChild(row);

        /* only one slot can be chosen at a time */
        checkbox.addEventListener("change", function () {
            container.querySelectorAll(".schedule-row").forEach(function (r) {
                r.classList.remove("active-slot");
                var box = r.querySelector("input");
                if (box !== checkbox) box.checked = false;
            });

            if (checkbox.checked) {
                row.classList.add("active-slot");
                selectedSlot = slot.time;
            } else {
                selectedSlot = null;
            }
        });
    });
}

function submitBooking(status) {
    var concern = document.getElementById("concern-summary").value.trim();

    if (!getStudent()) {
        alert("Please log in before booking a session.");
        window.location.href = "index.html";
        return;
    }

    if (!selectedSlot) {
        alert("Please select a time slot.");
        return;
    }

    if (status === "Pending" && !concern) {
        alert("Please write a short summary of your concern.");
        return;
    }

    var body = {
        student: getStudent(),
        course: document.getElementById("course-select").value,
        mentor: document.getElementById("mentor-field").value,
        date: document.getElementById("booking-date").value,
        timeSlot: selectedSlot,
        concern: concern,
        status: status
    };

    var saved = false;

    fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(function (response) {
            saved = response.ok;
            return response.json();
        })
        .then(function (data) {
            alert(data.message);

            if (saved) {
                document.getElementById("concern-summary").value = "";
            }
            loadSlots();
        })
        .catch(function () {
            alert("Could not reach the server. Is it running?");
        });
}
document.addEventListener("DOMContentLoaded", function () {
    var username = sessionStorage.getItem("username");
    var displayName = sessionStorage.getItem("studentName") || username || "Student";
    document.querySelectorAll(".student-name").forEach(function (element) {
        element.textContent = displayName;
    });

    var dateInput = document.getElementById("booking-date");
    dateInput.min = todayString();
    dateInput.value = todayString();
    dateInput.addEventListener("change", loadSlots);

    document.querySelector(".booking-form").addEventListener("submit", function (e) {
        e.preventDefault();
        submitBooking("Pending");
    });

    document.querySelector(".btn-secondary").addEventListener("click", function () {
        submitBooking("Draft");
    });

    updateMentorName();
});