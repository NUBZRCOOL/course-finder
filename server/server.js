const express = require('express');
const fs = require('fs');
const app = express();

const port = 5000;

app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "https://course-finder-coral.vercel.app/");

    next();
})


app.get("/getCiC", (req, res) => {


    // Assume fullName is stored in a variable
    const fullName = req.query.fullName; // Replace with the actual full name to search

    // Read and parse the JSON file
    const data = fs.readFileSync('fullclass2028.json');
    const fullClass = JSON.parse(data);

    const listOfCommoners = [];

    // Find the user by full name
    const user = fullClass.find(person => person.name.trim() === fullName.trim());

    if (!user) {
        console.log(`User with name ${fullName} not found.`);
        res.send(`User with name ${fullName} not found.`);
        // process.exit(1);
        return;
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

    // // Store the output in a string variable
    // let output = `List of course commoners for: ${user.name}\n`;
    // if (foundCommoners) {
    //     commoners.forEach(person => {
    //         output += `Admin:(${person.isAdmin}) ${person.name}: \n\tShared Courses: ${person.count}\n`;
    //     });
    // } else {
    //     output += 'No commoners found.\n';
    // }

    let output = `List of course commoners for: ${user.name}<br>`;
    if (foundCommoners) {
        commoners.forEach(person => {
            output += `Admin:(${person.isAdmin}) ${person.name}: <br>\tShared Courses: ${person.count}<br>`;
        });
    } else {
        output += 'No commoners found.<br>';
    }

    
    res.send(`${output}`);
})

// app.listen(port, () => {

//     console.log(`Listening on port: ${port}`);
// })
module.exports = app;