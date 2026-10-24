async function checkCredentials() {
    const username = document.getElementById("user-input").value.trim();
    const password = document.getElementById("pass-input").value.trim();

    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return;
    }

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password })
    });
    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    alert("Login successful, Welcome!");
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("initials", data.initials || username.slice(0, 2).toUpperCase());

    if (data.role === "mentor") {
        window.location.href = "teacher.html";
    } else {
        window.location.href = "student.html";
    }
}