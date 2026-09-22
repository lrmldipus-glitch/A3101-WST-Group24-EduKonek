function checkCredentials() {
    const username = document.getElementById("user-input").value.trim();
    const password = document.getElementById("pass-input").value.trim();

    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return;
    }

    if (username === "Mentor" && password === "12345") {
        alert("Login successful, Welcome!");
        window.location.href = "teacher.html";
    } else if (username === "Student" && password === "12345") {
        alert("Login successful, Welcome!" );
        window.location.href = "Student.html";
    } else {
        alert("Invalid username or password.");
    }
}
