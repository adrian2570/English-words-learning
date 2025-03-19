const questionText = document.getElementById("question-text");

async function loadWordsFromCSV(filePath) {
    try {
        // Fetch the CSV file
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load CSV file: ${response.statusText}`);
        }
        const csvData = await response.text();

        // Parse the CSV into lines and filter out empty ones
        const lines = csvData.trim().split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            throw new Error("CSV file has no data rows.");
        }

        // Split the first line into headers and the rest into data rows
        const headers = lines[0].split(',').map(h => h.trim());
        const dataRows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));

        // Log headers for debugging (optional)
        console.log("CSV Headers:", headers);

        // Display the first word and definition (assuming at least 2 columns)
        if (dataRows.length > 0 && dataRows[0].length >= 2) {
            const firstRow = dataRows[0];
            questionText.textContent = `Word: ${firstRow[0]}, Definition: ${firstRow[1]}`;
        } else {
            questionText.textContent = "No valid data found in CSV.";
        }

    } catch (error) {
        // Handle errors and show them on the webpage
        console.error("Error loading or parsing CSV:", error);
        questionText.textContent = `Error: ${error.message}`;
    }
}

// Call the function with your CSV file path
loadWordsFromCSV('English Learning.csv');
