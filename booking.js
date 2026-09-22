/* --- Jabez Anthony: Booking & Available Schedules Script --- */

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
};