const express = require('express');
const cors = require('cors'); // Import the cors middleware
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;
const fileName = "./bugs.json";

app.use(cors()); // Use the cors middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit', async (req, res) => {
    try {
        const email = req.body.email; // Get username from form
        const report = req.body.bug; // Get bug description from form
        const newData = {
            "email": email,
            "report": report
        };
        // Check if the file exists
        const fileExists = await doesFileExist(fileName);
        if (!fileExists) {
            // Create the file with initial data
            await createFileWithInitialData(fileName, newData);
        } else {
            // Read and update the file
            const existingData = await readJSONFile(fileName);
            existingData.push(newData);
            await writeJSONFile(fileName, existingData);
        }
        res.status(200).json({ message: 'Data appended successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing the request' });
    }
});

async function doesFileExist(filePath) {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

async function createFileWithInitialData(filePath, initialData) {
    const initialJsonData = JSON.stringify([initialData], null, 2);
    await fs.writeFile(filePath, initialJsonData, 'utf8');
}

async function readJSONFile(filePath) {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}

async function writeJSONFile(filePath, data) {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf8');
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
