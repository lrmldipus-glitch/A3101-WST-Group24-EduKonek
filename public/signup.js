async function registerAccount() {
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const course = document.getElementById("course").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const studentId = document.getElementById("student-id").value.trim();


    const picked = document.querySelector('input[name="gender"]:checked');
    const gender = picked ? picked.value : "";

    if (firstName === "" || lastName === "" || username === "" || password === "" || email === "" || studentId === "") {
        alert("Please fill in all required fields.");
        return;
    }

    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            course: course,
            username: username,
            password: password,
            email: email,
            phone: phone,
            studentId: studentId,
            gender: gender
        })
    });
    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    alert("Your Account has been Created! You can now log in.");
    window.location.href = "index.html";
}