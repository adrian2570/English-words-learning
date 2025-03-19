const questionText = document.getElementById("question-text");

async function loadWordsFromCSV(filePath) {
    try {
        const response = await fetch(filePath);
        const csvData = await response.text();
        console.log("CSV Data:", csvData); // VERY IMPORTANT
        questionText.textContent = "Data loaded. Check console.";
    } catch (error) {
        console.error("Error loading CSV:", error);
        questionText.textContent = "Error loading word list.";
    }
}

loadWordsFromCSV('English Learning.csv');
