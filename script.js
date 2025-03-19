// script.js

// DOM element references
const sentenceDiv = document.getElementById("sentence");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackDiv = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

// Global variables to hold sentence data
let currentSentence = null;
let sentencesData = [];

/*
  To add new sentences to learn:
  Simply update the "English Learning.csv" file by adding a new row with two columns:
  - "sentence": the full sentence with the part to be blanked out.
  - "blank": the exact substring within the sentence to replace with "___".
  For example, to add:
  "It was a bright sunny day and the park was full of people enjoying the ___ in the warmth.","breeze"
  just add a new row following this format.
*/

// Function to load and parse the CSV file using PapaParse
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

// Function to speak the sentence using the Web Speech API
function speakSentence(text) {
    if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported on this device.');
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language to English
    utterance.rate = 0.9;     // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
}

// Function to select and display a random sentence with the blank
function displayRandomSentence(data) {
    if (data.length === 0) return;
    const index = Math.floor(Math.random() * data.length);
    currentSentence = data[index];

    // Create a sentence with the blank (replace the substring exactly matching "blank")
    let sentenceWithBlank = currentSentence.sentence;
    if (sentenceWithBlank.includes(currentSentence.blank)) {
        sentenceWithBlank = sentenceWithBlank.replace(currentSentence.blank, '___');
    } else {
        console.warn('Blank text not found in sentence. Please check the CSV data.');
    }

    // Update the DOM for mobile-friendly display
    sentenceDiv.textContent = sentenceWithBlank;
    answerInput.value = '';
    feedbackDiv.textContent = '';
    answerInput.focus(); // Focus on input for immediate typing

    // Speak the sentence aloud
    speakSentence(sentenceWithBlank);
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
    } else {
        feedbackDiv.textContent = 'Incorrect, try again or move to the next sentence.';
        feedbackDiv.style.color = 'red';
    }
}

// Load CSV data and initialize event listeners
loadCSV().then(data => {
    if (data.length > 0) {
        sentencesData = data;
        displayRandomSentence(sentencesData);

        submitBtn.addEventListener('click', checkAnswer);
        nextBtn.addEventListener('click', () => displayRandomSentence(sentencesData));

        // Allow submitting the answer by pressing Enter
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
});