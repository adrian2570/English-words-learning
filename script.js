const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const checkAnswerButton = document.getElementById("check-answer");
const showDefinitionButton = document.getElementById("show-definition");
const speakButton = document.getElementById("speak-button");
const nextButton = document.getElementById("next-button");
const definitionText = document.getElementById("definition-text");
const exampleText = document.getElementById("example-text");
const instructions = document.getElementById("instructions");

let words =; // Initialize an empty array to store words
let currentWordIndex = 0;

// Function to load data from CSV file
async function loadWordsFromCSV(filePath) {
    try {
        const response = await fetch(filePath);
        const csvData = await response.text();
        const lines = csvData.trim().split('\n');
        const headers = lines[0].split(',');
        const data =;

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const wordObject = {};
            for (let j = 0; j < headers.length; j++) {
                wordObject[headers[j].trim()] = values[j].trim();
            }
            data.push(wordObject);
        }
        words = data;
        displayQuestion(); // Call displayQuestion after loading data
    } catch (error) {
        console.error("Error loading CSV:", error);
        questionText.textContent = "Error loading word list.";
    }
}

function displayQuestion() {
    if (currentWordIndex < words.length) {
        const currentWordData = words[currentWordIndex];
        const blankSentence = currentWordData.sentence.replace(currentWordData.word, "________"); // Replace the word with blanks
        questionText.textContent = blankSentence;
        answerInput.value = ""; // Clear previous answer
        exampleText.style.display = "none";
        exampleText.classList.remove("incorrect"); // Remove any previous incorrect styling
        definitionText.style.display = "none"; // Hide definition initially
        checkAnswerButton.textContent = "Check Answer";
    } else {
        questionText.textContent = "You've reached the end of the quiz!";
        answerInput.style.display = "none";
        checkAnswerButton.style.display = "none";
        showDefinitionButton.style.display = "none";
        speakButton.style.display = "none";
        nextButton.style.display = "none";
    }
}

checkAnswerButton.addEventListener("click", function() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = words[currentWordIndex].word.toLowerCase();

    if (userAnswer === correctAnswer) {
        exampleText.textContent = `Correct! The word is "${words[currentWordIndex].word}".`;
        exampleText.style.display = "block";
    } else {
        exampleText.textContent = `Incorrect. The correct word is "${words[currentWordIndex].word}".`;
        exampleText.style.display = "block";
        exampleText.classList.add("incorrect");
    }
});

showDefinitionButton.addEventListener("click", function() {
    definitionText.textContent = words[currentWordIndex].definition;
    definitionText.style.display = "block";
});

speakButton.addEventListener("click", function() {  // Speak button click
    const wordToSpeak = words[currentWordIndex].word;
    speakText(wordToSpeak);
});

nextButton.addEventListener("click", function() {
    currentWordIndex++;
    displayQuestion();
});

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

// Load the words from the CSV file when the script runs
loadWordsFromCSV('English Learning.csv');
