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

        if (hasNumber(firstName)) {
        alert("First name cannot have numbers.");
        return;
    }

    if (hasNumber(lastName)) {
        alert("Last name cannot have numbers.");
        return;
    }

    if (hasNumber(username)) {
        alert("Username cannot have numbers.");
        return;
    }

        if (phone !== "") {
        if (!hasOnlyDigits(phone)) {
            alert("Phone number can only have numbers.");
            return;
        }

        if (phone.length !== 11) {
            alert("Phone number must be 11 digits.");
            return;
        }
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

function hasNumber(text) {
    const digits = "0123456789";
    for (let i = 0; i < text.length; i++) {
        if (digits.includes(text[i])) {
            return true;
        }
    }
    return false;
}

   function hasOnlyDigits(text) {
    const digits = "0123456789";
    for (let i = 0; i < text.length; i++) {
        if (!digits.includes(text[i])) {
            return false;
        }
    }
    return true;
}