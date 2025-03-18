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

let wordsData =;
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
        const newWordsIndex = headers.indexOf("New Words");
        const examplesIndex = headers.indexOf("Examples");
        const data =;

        if (newWordsIndex === -1 || examplesIndex === -1) {
            questionText.textContent = "Error: CSV file must have columns 'New Words' and 'Examples'.";
            return;
        }

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length > newWordsIndex && values.length > examplesIndex) {
                const newWords = values[newWordsIndex].trim().split(' '); // Split into array of words
                const example = values[examplesIndex].trim();
                data.push({ words: newWords, sentence: example });
            }
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
        const currentWordData = wordsData[currentWordIndex];
        let sentence = currentWordData.sentence;
        currentWordData.words.forEach(word => {
            const regex = new RegExp(word, 'gi');
            sentence = sentence.replace(regex, "____");
        });
        questionText.textContent = sentence;
        answerInput.value = "";
        exampleText.style.display = "none";
        exampleText.innerHTML = "";
        definitionText.style.display = "none";
        definitionText.innerHTML = "";
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
    const correctWords = wordsData[currentWordIndex].words.map(word => word.trim().toLowerCase());
    const userAnswers = userAnswer.split(',').map(answer => answer.trim().toLowerCase());
    let feedback = "";
    let allCorrect = true;
    const originalSentence = wordsData[currentWordIndex].sentence;

    const feedbackSentenceParts = originalSentence.split(new RegExp(correctWords.map(word => `(${word})`).join('|'), 'gi'));
    let feedbackIndex = 0;

    feedbackSentenceParts.forEach(part => {
        const trimmedPart = part.trim();
        if (trimmedPart) {
            const foundIndex = correctWords.findIndex(word => trimmedPart.toLowerCase() === word);
            if (foundIndex !== -1 && feedbackIndex < userAnswers.length && userAnswers[feedbackIndex] === correctWords[foundIndex]) {
                feedback += `<span class="correct-word">${trimmedPart}</span>`;
                feedbackIndex++;
            } else if (foundIndex !== -1) {
                feedback += `<span class="incorrect-word">${trimmedPart}</span>`;
                allCorrect = false;
                feedbackIndex++;
            } else {
                feedback += part;
            }
        } else {
            if (feedbackIndex < userAnswers.length && correctWords.includes(userAnswers[feedbackIndex])) {
                feedback += `<span class="correct-word">${correctWords[correctWords.findIndex(word => word === userAnswers[feedbackIndex])]}</span>`;
                feedbackIndex++;
            } else if (feedbackIndex < correctWords.length) {
                feedback += `<span class="incorrect-word">${correctWords[feedbackIndex]}</span>`;
                allCorrect = false;
                feedbackIndex++;
            }
        }
    });

    if (userAnswers.length !== correctWords.length) {
        feedback = "Please provide the correct number of words.";
        allCorrect = false;
    } else if (allCorrect) {
        exampleText.innerHTML = "Correct! The sentence was: " + originalSentence;
    } else {
        exampleText.innerHTML = "Incorrect. The sentence was: " + feedback;
    }

    exampleText.style.display = "block";
});

showDefinitionButton.style.display = "none"; // Keeping definition hidden for now

speakButton.addEventListener("click", function() {
    const firstWordToSpeak = wordsData[currentWordIndex].words[0]; // Speak the first word
    if (firstWordToSpeak) {
        speakText(firstWordToSpeak.trim());
    }
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
