function checkCredentials() {
    const username = document.getElementById("user-input").value.trim();
    const password = document.getElementById("pass-input").value.trim();

    // Sample lang po na credentials :> //

    
    const validUsername = "admin";
    const validPassword = "password123";

    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return;
    }

    if (username === validUsername && password === validPassword) {
        alert("Login successful!");
        window.location.href = "Dashboard.html"; 
    } else {
        alert("Invalid username or password.");
    }
}
