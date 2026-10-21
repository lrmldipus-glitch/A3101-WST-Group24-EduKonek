var displayName = (sessionStorage.getItem("studentName") || sessionStorage.getItem("username") || "Student").trim();
var nameParts = displayName.split(/\s+/).filter(Boolean);
var initials = nameParts.length > 1
    ? nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    : (nameParts[0] || "S").slice(0, 2);

document.querySelectorAll(".user-icon").forEach(function (element) {
    element.textContent = initials.toUpperCase();
});
