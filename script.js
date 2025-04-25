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
    let usedQuestions = new Set(); // Track previously used questions


    const totalQuestions = 10;
    const quizDuration = 60;

    let currentQuestionIndex = 0;
    let currentQuestions = [];
    let score = 0;
    let timeLeft = quizDuration;
    let timerInterval;
    let allQuestions = [];

    questionNumberElement.textContent = 0;

    // Pop-in animation style
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
    `;
    document.head.appendChild(style);

    fetch('./assets/questions.json')
        .then(response => response.json())
        .then(data => {
            allQuestions = data;
        })
        .catch(error => console.error('Error loading questions:', error));

    function startGame_old() {
        startPage.style.display = 'none';
        quizPage.style.display = 'block';
        score = 0;
        
        currentQuestionIndex = 0;
        questionNumberElement.textContent = 0;
        const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
        currentQuestions = shuffledQuestions.slice(0, totalQuestions);
        timeLeft = quizDuration;
        timerElement.textContent = `Time: ${timeLeft}`;
        startQuizTimer(); // Start the quiz timer
        loadQuestion();
    }

    function startGame() {

  // Play start sound
  const startSound = document.getElementById('start-sound');
  startSound.play();

        startPage.style.display = 'none';
        quizPage.style.display = 'block';
        score = 0;
        currentQuestionIndex = 0;
        questionNumberElement.textContent = 0;
    
        // Filter out used questions
        const unusedQuestions = allQuestions.filter(q => !usedQuestions.has(q.question));
    
        let selectedQuestions = [];
    
        if (unusedQuestions.length >= totalQuestions) {
            // If enough unused questions, pick randomly from them
            selectedQuestions = unusedQuestions
                .sort(() => Math.random() - 0.5)
                .slice(0, totalQuestions);
        } else {
            // If not enough unused, take all unused and fill rest with random from allQuestions
            selectedQuestions = [...unusedQuestions];
    
            const needed = totalQuestions - selectedQuestions.length;
            const remaining = [...allQuestions]
                .sort(() => Math.random() - 0.5)
                .filter(q => !selectedQuestions.includes(q))
                .slice(0, needed);
    
            selectedQuestions = selectedQuestions.concat(remaining);
        }
    
        // Mark selected questions as used
        selectedQuestions.forEach(q => usedQuestions.add(q.question));
    
        currentQuestions = selectedQuestions;
    
        timeLeft = quizDuration;
        timerElement.textContent = `Time: ${timeLeft}`;
        startQuizTimer();
        loadQuestion();

          // Play background music during quiz
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.play();
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

    function loadQuestion_old() {
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

    function loadQuestion() {
        resetOptions();
        optionButtons.forEach(button => {
            button.classList.remove('pop');
            button.style.display = 'none';
        });
    
        if (currentQuestionIndex < currentQuestions.length) {
            const currentQ = currentQuestions[currentQuestionIndex];
            
            // Randomize the order of options
            const shuffledOptions = [...currentQ.options].sort(() => Math.random() - 0.5);
    
            // Store the correct answer reference
            const correctAnswer = currentQ.answer;
    
            // Assign shuffled options and mark the correct one
            optionButtons.forEach((button, index) => {
                if (index < shuffledOptions.length) {
                    button.textContent = shuffledOptions[index];
                    button.dataset.answer = shuffledOptions[index];
                    button.style.display = 'block';
                }
            });
    
            // Replace the original answer with the shuffled one
            currentQuestions[currentQuestionIndex].shuffledAnswer = correctAnswer;
    
            typeQuestion(`${currentQuestionIndex + 1}. ${currentQ.question}`, questionElement, animateOptionsIn);
        } else {
            endQuiz();
        }
    }
    

    function startQuizTimer() {
        clearInterval(timerInterval);
        
        // Set up the circle progress
        const circle = document.querySelector('.progress');
        const text = document.querySelector('.timer-text');
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = circumference;

        function setProgress(time) {
            const offset = circumference - (time / quizDuration) * circumference;
            circle.style.strokeDashoffset = offset;
            text.textContent = time;
        }

        // Timer logic
        timerInterval = setInterval(() => {
            timeLeft--;
            setProgress(timeLeft);
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

    function checkAnswer_old(selectedOption) {
        const currentQ = currentQuestions[currentQuestionIndex];
        if (selectedOption.dataset.answer === currentQ.answer) {
            score++;
        }
        showAnswer(selectedOption);
    }

    function checkAnswer(selectedOption) {
        const currentQ = currentQuestions[currentQuestionIndex];
        const correct = currentQ.answer;
    
        if (selectedOption.dataset.answer === correct) {
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
 // Stop background music and play end music
 const backgroundMusic = document.getElementById('background-music');
 const endMusic = document.getElementById('end-music');
 
 backgroundMusic.pause();
 backgroundMusic.currentTime = 0; // Reset to the start of the song
 endMusic.play();


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
