<!DOCTYPE html>
<html>
<head>
    <title>English Word Quiz</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 20px;
        }

        .word-box {
            border: 1px solid #ccc;
            padding: 20px;
            margin-bottom: 20px;
        }

        #word-title {
            font-size: 1.5em;
            margin-bottom: 15px;
        }

        #show-example {
            padding: 10px 20px;
            font-size: 1em;
            cursor: pointer;
        }

        #example-text {
            display: none;
            margin-top: 15px;
            font-size: 1.1em;
        }

        #speak-button {  /* Style the speak button */
            padding: 10px 20px;
            font-size: 1em;
            cursor: pointer;
            margin-top: 15px;
        }
    </style>
</head>
<body>

<div class="word-box">
    <h2 id="word-title">Word</h2>
    <button id="show-example">Show Example</button>
    <p id="example-text"></p>
    <button id="speak-button">Speak Word</button>  </div>

<script>
    // Sample data (replace with loading from CSV later)
    const words = [
        { word: "Annie developed an injury...", example: "That spring, Annie developed an injury..." },
        { word: "she needed to wear...", example: "This meant limited activities..." },
        // ... more words
    ];

    const wordTitle = document.getElementById("word-title");
    const showExampleButton = document.getElementById("show-example");
    const exampleText = document.getElementById("example-text");
    const speakButton = document.getElementById("speak-button");  // Get speak button

    let currentWordIndex = 0;

    function displayWord() {
        wordTitle.textContent = words[currentWordIndex].word;
        exampleText.style.display = "none";
        showExampleButton.textContent = "Show Example";
        showExampleButton.style.display = "block";
    }

    showExampleButton.addEventListener("click", function() {
        exampleText.textContent = words[currentWordIndex].example;
        exampleText.style.display = "block";
        showExampleButton.style.display = "none";
    });

    speakButton.addEventListener("click", function() {  // Speak button click
        const wordToSpeak = words[currentWordIndex].word;
        speakText(wordToSpeak);
    });

    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }

    // Initial display
    displayWord();
</script>

</body>
</html>
