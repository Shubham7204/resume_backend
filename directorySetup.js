const fs = require('fs');
const path = require('path');

// Ensure the directory exists
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    } else {
        console.log(`Directory already exists: ${dirPath}`);
    }
};

// Define paths for temp and pdfFiles directories
const tempDir = path.resolve(__dirname, 'temp');
const pdfFilesDir = path.resolve(__dirname, 'pdfFiles');

// Create the directories
ensureDirectoryExists(tempDir);
ensureDirectoryExists(pdfFilesDir);