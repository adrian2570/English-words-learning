// Get the DOM element where the content will be displayed
const questionText = document.getElementById("question-text");

// Function to load and parse the CSV file
async function loadWordsFromCSV(filePath) {
    try {
        // Fetch the CSV file
        const response = await fetch(filePath);
        
        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`Failed to load CSV file: ${response.statusText}`);
        }
        
        // Get the CSV data as text
        const csvData = await response.text();
        
        // Parse the CSV data into an array of rows
        const parsedData = parseCSV(csvData);
        
        // Check if the CSV has data
        if (!parsedData || parsedData.length === 0) {
            throw new Error("CSV file is empty or invalid.");
        }
        
        // Extract headers (first row) and data (remaining rows)
        const headers = parsedData[0];
        const data = parsedData.slice(1);
        
        // Log headers for debugging
        console.log("CSV Headers:", headers);
        
        // Display the first word and its definition (assuming columns: word, definition)
        if (data.length > 0) {
            const firstRow = data[0];
            questionText.textContent = `First word: ${firstRow[0]} - Definition: ${firstRow[1]}`;
        } else {
            questionText.textContent = "No data found in CSV.";
        }
        
    } catch (error) {
        // Display specific error messages in the DOM
        console.error("Error loading or parsing CSV:", error);
        questionText.textContent = `Error: ${error.message}`;
    }
}

// Simple CSV parser function (handles basic CSV structure)
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const result = lines.map(line => line.split(',').map(cell => cell.trim()));
    return result;
}

// Load the CSV file (replace 'English Learning.csv' with your actual file name)
loadWordsFromCSV('English Learning.csv');
