document.addEventListener('DOMContentLoaded', () => {
    const startPage = document.getElementById('start-page');
    const quizPage = document.getElementById('quiz-page');
    const resultsPage = document.getElementById('results-page');
    const startButton = document.getElementById('start-button');
    const questionElement = document.getElementById('question');
    const optionButtons = document.querySelectorAll('.option');
    const submitButton = document.getElementById('submit-button');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const correctAnswersElement = document.getElementById('correct-answers');
    const restartButton = document.getElementById('restart-button');

    let currentQuestionIndex = 0;
    let currentQuestions = [];
    let score = 0;
    let timeLeft = 15; // Total time for the quiz
    let timerInterval;
    let allQuestions = [];

    // Load questions from JSON file
    fetch('./assets/questions.json')
        .then(response => response.json())
        .then(data => {
            allQuestions = data;
        })
        .catch(error => console.error('Error loading questions:', error));

    function startGame() {
        startPage.style.display = 'none';
        quizPage.style.display = 'block';
        score = 0;
        currentQuestionIndex = 0;
        const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
        currentQuestions = shuffledQuestions.slice(0, 5);
        timeLeft = 15; // Reset the timer for each new quiz
        timerElement.textContent = `Time: ${timeLeft}`;
        startQuizTimer();
        loadQuestion();
    }

    function loadQuestion() {
        resetOptions();
        if (currentQuestionIndex < currentQuestions.length) {
            const currentQ = currentQuestions[currentQuestionIndex];
            questionElement.textContent = currentQ.question;

            if (currentQ.options && currentQ.options.length === 2) {
                optionButtons.forEach((button, index) => {
                    if (index < 2) {
                        button.textContent = currentQ.options[index];
                        button.dataset.answer = currentQ.options[index];
                        button.style.display = 'block';
                    } else {
                        button.style.display = 'none';
                    }
                });
            } else {
                console.error('Error: Each question must have exactly two options.');
                endQuiz();
            }
        } else {
            endQuiz();
        }
    }

    function startQuizTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endQuiz(); // End the quiz when time runs out
            }
        }, 1000);
    }

    function showAnswer(selectedOption) {
        const currentQ = currentQuestions[currentQuestionIndex];
        const correctOption = currentQ.answer;

        optionButtons.forEach(button => {
            button.classList.remove('correct', 'incorrect');
            button.disabled = true;

            if (button.dataset.answer === correctOption) {
                button.classList.add('correct');
            } else if (selectedOption && button.dataset.answer === selectedOption.dataset.answer) {
                button.classList.add('incorrect');
            }
        });

        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            setTimeout(loadQuestion, 1000); // Short delay before next question
        } else {
            setTimeout(endQuiz, 1000); // Show results after the last question
        }
    }

    function checkAnswer(selectedOption) {
        const currentQ = currentQuestions[currentQuestionIndex];
        if (selectedOption.dataset.answer === currentQ.answer) {
            score++;
        }
        showAnswer(selectedOption);
    }

    function resetOptions() {
        optionButtons.forEach(button => {
            button.classList.remove('correct', 'incorrect');
            button.disabled = false;
        });
    }

    function endQuiz() {
        clearInterval(timerInterval); // Stop the timer
        quizPage.style.display = 'none';
        resultsPage.style.display = 'block';
        scoreElement.textContent = score;
        correctAnswersElement.innerHTML = ''; // Clear the correct answers display
    }

    function restartGame() {
        resultsPage.style.display = 'none';
        startPage.style.display = 'block'; // Redirect to the start page
    }

    startButton.addEventListener('click', startGame);

    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            checkAnswer(this);
        });
    });

    restartButton.addEventListener('click', restartGame);
});