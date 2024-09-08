const express = require('express');
const fs = require('fs');
var path = require("path");
const cors = require('cors');
const app = express();

const port = 5000;


// var corsOptions = {
//     origin: ['https://course-finder-coral.vercel.app'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions));

app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
})


app.get("/getCiC", (req, res) => {

    // Assume fullName is stored in a variable
    const fullName = req.query.fullName; // Replace with the actual full name to search

    // Read and parse the JSON file
    const data = fs.readFileSync(path.resolve(__dirname, "fullclass2028.json"));
    const fullClass = JSON.parse(data);

    const listOfCommoners = [];

    // Find the user by full name
    const user = fullClass.find(person => person.name.trim().toLowerCase() === fullName.trim().toLowerCase());

    if (!user) {
        console.log(`User with name "${fullName}" not found.`);
        return res.json({
            message: `User with name "${fullName}" not found.`,
            commoners: []
        });
    }

    // Extract user courses
    const userCourses = new Set(user.periods.map(period => period.courseName));

    let foundCommoners = false;

    // Find commoners with the same courses
    for (const person of fullClass) {
        if (person.name.trim() === user.name.trim()) continue; // Skip the user themselves

        const personCourses = new Set(person.periods.map(period => period.courseName));

        // Find intersection of courses
        const commonCourses = [...userCourses].filter(course => personCourses.has(course));

        if (commonCourses.length > 0) {
            person.count = commonCourses.length;
            listOfCommoners.push(person);
            foundCommoners = true;
        }
    }

    const commoners = [];

    // Count occurrences of shared courses
    for (const person of listOfCommoners) {
        if (person.id === user.id) continue;

        const existing = commoners.find(p => p.id === person.id);
        if (existing) {
            existing.count += person.count;
        } else {
            commoners.push(person);
        }
    }

    // Sort commoners by count in descending order
    commoners.sort((a, b) => b.count - a.count);

    // Build the JSON response
    const jsonResponse = {
        message: `List of course commoners for: ${user.name}`,
        commoners: commoners.map(person => ({
            name: person.name,
            isAdmin: person.isAdmin,
            sharedCourses: person.count
        }))
    };

    // Send the JSON response
    res.json(jsonResponse);
});

// app.listen(port, () => {

//     console.log(`Listening on port: ${port}`);
// })
module.exports = app;