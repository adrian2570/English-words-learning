const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const checkAnswerButton = document.getElementById("check-answer");
const showDefinitionButton = document.getElementById("show-definition");
const speakButton = document.getElementById("speak-button");
const nextButton = document.getElementById("next-button");
const definitionText = document.getElementById("definition-text");
const exampleText = document.getElementById("example-text");
const instructions = document.getElementById("instructions");
const wordBox = document.querySelector('.word-box');

let wordsData =; // Renamed to avoid conflict with CSV column name
let currentWordIndex = 0;
let touchStartX = null;
let touchEndX = null;
const swipeThreshold = 50;

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
        wordsData = data;
        displayQuestion();
    } catch (error) {
        console.error("Error loading CSV:", error);
        questionText.textContent = "Error loading word list.";
    }
}

function displayQuestion() {
    if (currentWordIndex < wordsData.length) {
        questionText.textContent = wordsData[currentWordIndex].sentence;
        answerInput.value = "";
        exampleText.style.display = "none";
        exampleText.innerHTML = ""; // Clear previous feedback
        definitionText.style.display = "none";
        definitionText.innerHTML = ""; // Clear previous definitions
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
    const correctWords = wordsData[currentWordIndex].words.toLowerCase().split(',');
    const userAnswers = userAnswer.split(',').map(answer => answer.trim());
    let feedback = "";
    let allCorrect = true;

    for (let i = 0; i < correctWords.length; i++) {
        const correctWord = correctWords[i].trim();
        if (i < userAnswers.length && userAnswers[i].trim() === correctWord) {
            feedback += `<span class="correct-word">${correctWord}</span> `;
        } else {
            feedback += `<span class="incorrect-word">${correctWord}</span> `;
            allCorrect = false;
        }
    }

    exampleText.innerHTML = allCorrect ? "Correct! The sentence was: " + wordsData[currentWordIndex].sentence.replace(/____/g, (match, i) => `<span class="correct-word">${correctWords[i].trim()}</span>`) : "Incorrect. The sentence was: " + wordsData[currentWordIndex].sentence.replace(/____/g, (match, i) => `<span class="${i < userAnswers.length && userAnswers[i].trim() === correctWords[i].trim() ? 'correct-word' : 'incorrect-word'}">${correctWords[i].trim()}</span>`);
    exampleText.style.display = "block";
});

showDefinitionButton.addEventListener("click", function() {
    const definitions = wordsData[currentWordIndex].definition.split(',');
    let definitionHTML = "";
    const correctWords = wordsData[currentWordIndex].words.split(',');

    if (definitions.length === correctWords.length) {
        for (let i = 0; i < definitions.length; i++) {
            definitionHTML += `<p><strong>${correctWords[i].trim()}:</strong> ${definitions[i].trim()}</p>`;
        }
    } else {
        definitionHTML = "<p>Definitions not available in the expected format.</p>";
    }
    definitionText.innerHTML = definitionHTML;
    definitionText.style.display = "block";
});

speakButton.addEventListener("click", function() {
    const wordsToSpeak = wordsData[currentWordIndex].words.split(',')[0]; // Speak the first missing word
    speakText(wordsToSpeak.trim());
});

nextButton.addEventListener("click", function() {
    currentWordIndex++;
    displayQuestion();
});

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

wordBox.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

wordBox.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (!touchStartX || !touchEndX) {
        return;
    }

    const deltaX = touchEndX - touchStartX;

    if (deltaX < -swipeThreshold) {
        if (currentWordIndex < wordsData.length - 1) {
            currentWordIndex++;
            displayQuestion();
        } else {
            alert("You've reached the last sentence!");
        }
    }

    touchStartX = null;
    touchEndX = null;
}

loadWordsFromCSV('English Learning.csv');
