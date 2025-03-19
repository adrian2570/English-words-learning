const questionText = document.getElementById("question-text");

async function loadWordsFromCSV(filePath) {
    try {
        const response = await fetch(filePath);
        const csvData = await response.text();
        console.log("CSV Data:", csvData);

        const lines = csvData.trim().split('\n');
        const headers = lines[0].split(',');
        console.log("CSV Headers:", headers); // Check the headers

        questionText.textContent = "Headers loaded. Check console.";
    } catch (error) {
        console.error("Error loading CSV:", error);
        questionText.textContent = "Error loading word list.";
    }
}

loadWordsFromCSV('English Learning.csv');
