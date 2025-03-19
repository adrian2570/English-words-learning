// Get DOM elements
const sentenceDiv = document.getElementById("sentence");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackDiv = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

// Variable to hold the current sentence data
let currentSentence = null;

// Function to load and parse the CSV file
async function loadCSV() {
    try {
        const response = await fetch('English Learning.csv');
        if (!response.ok) {
            throw new Error('Failed to load CSV file');
        }
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });
        if (parsed.errors.length > 0) {
            throw new Error('Error parsing CSV');
        }
        return parsed.data;
    } catch (error) {
        console.error(error);
        sentenceDiv.textContent = 'Error loading sentences. Please check the CSV file.';
        return [];
    }
}

// Function to select a random sentence and display it with a blank
function displayRandomSentence(data) {
    if (data.length === 0) return;
    const index = Math.floor(Math.random() * data.length);
    currentSentence = data[index];
    const sentenceWithBlank = currentSentence.sentence.replace(currentSentence.blank, '___');
    sentenceDiv.textContent = sentenceWithBlank;
    answerInput.value = '';
    feedbackDiv.textContent = '';
    nextBtn.disabled = true;
    answerInput.focus(); // Focus on the input field for immediate typing
}

// Function to check the user's answer
function checkAnswer() {
    if (!currentSentence) return;
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentSentence.blank.toLowerCase();
    if (userAnswer === '') {
        feedbackDiv.textContent = 'Please enter an answer.';
        feedbackDiv.style.color = 'orange';
    } else if (userAnswer === correctAnswer) {
        feedbackDiv.textContent = 'Correct!';
        feedbackDiv.style.color = 'green';
        nextBtn.disabled = false;
    } else {
        feedbackDiv.textContent = 'Incorrect, try again.';
        feedbackDiv.style.color = 'red';
    }
}

// Load the CSV and start the tool
loadCSV().then(data => {
    if (data.length > 0) {
        displayRandomSentence(data);
        submitBtn.addEventListener('click', checkAnswer);
        nextBtn.addEventListener('click', () => displayRandomSentence(data));
        // Allow submitting with Enter key
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
});
