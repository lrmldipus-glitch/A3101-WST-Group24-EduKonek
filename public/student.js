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
