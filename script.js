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
    const questionNumberElement = document.getElementById('question-number');
    const progressBarElement = document.getElementById('progress-bar');

    const totalQuestions = 10;
    const quizDuration = 30;

    let currentQuestionIndex = 0;
    let currentQuestions = [];
    let score = 0;
    let timeLeft = quizDuration;
    let timerInterval;
    let allQuestions = [];

    questionNumberElement.textContent = 0;

    // Add pop-in animation style
    

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes popInBouncy {
            0% {
                transform: scale(0.5);
                opacity: 0;
            }
            60% {
                transform: scale(1.2);
                opacity: 1;
            }
            80% {
                transform: scale(0.95);
            }
            100% {
                transform: scale(1);
            }
        }
        .pop {
            animation: popInBouncy 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
            @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .pop {
            animation: popIn 0.3s ease forwards;
        }
    `
    ;
    document.head.appendChild(style);
    


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
        currentQuestions = shuffledQuestions.slice(0, totalQuestions);
        timeLeft = quizDuration;
        timerElement.textContent = `Time: ${timeLeft}`;
        startQuizTimer();
        loadQuestion();
    }

    function typeQuestion(text, element, callback) {
        let index = 0;
        element.textContent = '';
        const interval = setInterval(() => {
            element.textContent += text.charAt(index);
            index++;
            if (index === text.length) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 30);
    }

    function animateOptionsIn() {
        optionButtons.forEach((button, index) => {
            setTimeout(() => {
                button.classList.add('pop');
                button.style.display = 'block';
            }, index * 100);
        });
    }

    function loadQuestion() {
        resetOptions();
        optionButtons.forEach(button => {
            button.classList.remove('pop');
            button.style.display = 'none';
        });

        if (currentQuestionIndex < currentQuestions.length) {
            const currentQ = currentQuestions[currentQuestionIndex];

            if (currentQ.options && currentQ.options.length === 2) {
                optionButtons.forEach((button, index) => {
                    if (index < 2) {
                        button.textContent = currentQ.options[index];
                        button.dataset.answer = currentQ.options[index];
                    }
                });

                typeQuestion(`${currentQuestionIndex + 1}. ${currentQ.question}`, questionElement, animateOptionsIn);
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
                endQuiz();
            }
        }, 1000);
    }

    function showAnswer(selectedOption) {
        const currentQ = currentQuestions[currentQuestionIndex];
        const correctOption = currentQ.answer;

        optionButtons.forEach(button => {
            button.classList.remove('correct', 'incorrect');
            button.disabled = true;
        });

        if (selectedOption && selectedOption.dataset.answer === correctOption) {
            selectedOption.classList.add('correct');
        } else if (selectedOption) {
            selectedOption.classList.add('incorrect');
            optionButtons.forEach(button => {
                if (button.dataset.answer === correctOption) {
                    button.classList.add('correct');
                }
            });
        } else {
            optionButtons.forEach(button => {
                if (button.dataset.answer === correctOption) {
                    button.classList.add('correct');
                }
            });
        }

        updateProgress();

        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            setTimeout(loadQuestion, 1000);
        } else {
            setTimeout(endQuiz, 1000);
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
            button.classList.remove('correct', 'incorrect', 'pop');
            button.disabled = false;
        });
    }

    function endQuiz() {
        clearInterval(timerInterval);
        quizPage.style.display = 'none';
        resultsPage.style.display = 'block';
        scoreElement.textContent = score;
        correctAnswersElement.innerHTML = '';
    }

    function restartGame() {
        resultsPage.style.display = 'none';
        startPage.style.display = 'block';
    }

    function updateProgress() {
        const progress = (currentQuestionIndex + 1) / totalQuestions;
        progressBarElement.style.width = `${progress * 100}%`;
        questionNumberElement.textContent = currentQuestionIndex + 1;
    }

    startButton.addEventListener('click', startGame);

    optionButtons.forEach(button => {
        button.addEventListener('click', function () {
            checkAnswer(this);
        });
    });

    restartButton.addEventListener('click', restartGame);
});
