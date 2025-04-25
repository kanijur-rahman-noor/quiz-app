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

    allQuestions = [
        {"question": "Which planet is known as the \"Red Planet\"?", "options": ["Mars", "Venus"], "answer": "Mars"},
        {"question": "What is the largest mammal in the world?", "options": ["Blue Whale", "Elephant"], "answer": "Blue Whale"},
        {"question": "Which language has the most native speakers?", "options": ["Mandarin", "Spanish"], "answer": "Mandarin"},
        {"question": "Who painted the Mona Lisa?", "options": ["Leonardo da Vinci", "Michelangelo"], "answer": "Leonardo da Vinci"},
        {"question": "Which gas do plants absorb for photosynthesis?", "options": ["Carbon Dioxide", "Oxygen"], "answer": "Carbon Dioxide"},
        {"question": "What is the hardest natural substance on Earth?", "options": ["Diamond", "Quartz"], "answer": "Diamond"},
        {"question": "Which country is both a continent and an island?", "options": ["Australia", "Greenland"], "answer": "Australia"},
        {"question": "Who wrote \"Romeo and Juliet\"?", "options": ["William Shakespeare", "Charles Dickens"], "answer": "William Shakespeare"},
        {"question": "What is the capital of Canada?", "options": ["Ottawa", "Toronto"], "answer": "Ottawa"},
        {"question": "Which element has the chemical symbol \"O\"?", "options": ["Oxygen", "Gold"], "answer": "Oxygen"},
        {"question": "What does \"CPU\" stand for?", "options": ["Central Processing Unit", "Computer Power Unit"], "answer": "Central Processing Unit"},
        {"question": "Which company developed the Python programming language?", "options": ["Python Software Foundation", "Microsoft"], "answer": "Python Software Foundation"},
        {"question": "What is the latest WiFi standard as of 2024?", "options": ["WiFi 6E", "WiFi 5"], "answer": "WiFi 6E"},
        {"question": "Which protocol is used for secure web browsing?", "options": ["HTTPS", "HTTP"], "answer": "HTTPS"},
        {"question": "What does \"AI\" stand for?", "options": ["Artificial Intelligence", "Automated Interface"], "answer": "Artificial Intelligence"},
        {"question": "Which company owns the Android operating system?", "options": ["Google", "Apple"], "answer": "Google"},
        {"question": "What is the main function of a GPU?", "options": ["Graphics Processing", "Data Storage"], "answer": "Graphics Processing"},
        {"question": "Which of these is a blockchain-based cryptocurrency?", "options": ["Bitcoin", "PayPal"], "answer": "Bitcoin"},
        {"question": "What does \"URL\" stand for?", "options": ["Uniform Resource Locator", "Universal Reference Link"], "answer": "Uniform Resource Locator"},
        {"question": "Which device converts digital signals to analog for internet use?", "options": ["Modem", "Router"], "answer": "Modem"},
        {"question": "Which country has won the most FIFA World Cups?", "options": ["Brazil", "Germany"], "answer": "Brazil"},
        {"question": "Who holds the men's 100m sprint world record?", "options": ["Usain Bolt", "Tyson Gay"], "answer": "Usain Bolt"},
        {"question": "In which sport is the term \"Grand Slam\" used?", "options": ["Tennis", "Golf"], "answer": "Tennis"},
        {"question": "Who is the CEO of Tesla?", "options": ["Elon Musk", "Jeff Bezos"], "answer": "Elon Musk"},
        {"question": "Which company owns the brand \"WhatsApp\"?", "options": ["Meta (Facebook)", "Google"], "answer": "Meta (Facebook)"},
        {"question": "What does \"IPO\" stand for?", "options": ["Initial Public Offering", "International Purchase Order"], "answer": "Initial Public Offering"},
        {"question": "Which company is the worldss largest e-commerce retailer?", "options": ["Amazon", "Alibaba"], "answer": "Amazon"},
        {"question": "What is Netflix's primary product?", "options": ["Streaming Services", "Video Games"], "answer": "Streaming Services"},
        {"question": "Which brandís slogan is \"Just Do It\"? ", "options": ["Nike", "Adidas"], "answer": "Nike"},
        {"question": "What does \"B2B\" stand for?", "options": ["Business to Business", "Brand to Brand"], "answer": "Business to Business"},
        {"question": "Who founded Microsoft?", "options": ["Bill Gates", "Steve Jobs"], "answer": "Bill Gates"},
        {"question": "Which company owns the social media platform \"Instagram\"?", "options": ["Meta", "Twitter"], "answer": "Meta"},
        {"question": "What is Warren Buffettís investment company called?", "options": ["Berkshire Hathaway", "BlackRock"], "answer": "Berkshire Hathaway"},
        {"question": "Which country recently became the most populous in the world?", "options": ["China", "Nigeria"], "answer": "Nigeria"},
        {"question": "Which tech company announced a 10-for-1 stock split in 2024?", "options": ["Nvidia", "Apple"], "answer": "Nvidia"},
        {"question": "Which African country joined BRICS in 2024?", "options": ["Ethiopia", "Egypt"], "answer": "Ethiopia"},
        {"question": "Who is the current UN Secretary-General?", "options": ["AntÛnio Guterres", "Ban Ki-moon"], "answer": "AntÛnio Guterres"},
        {"question": "Which country recently introduced a digital-only currency?", "options": ["Nigeria", "UK"], "answer": "Nigeria"},
        {"question": "Which soft skill is most important in leadership?", "options": ["Communication", "Technical Expertise"], "answer": "Communication"},
        {"question": "What does \"KPI\" stand for?", "options": ["Key Performance Indicator", "Key Process Integration"], "answer": "Key Performance Indicator"},
        {"question": "Which tool is essential for data analysis in Excel?", "options": ["Pivot Table", "Bar Chart"], "answer": "Pivot Table"},
        {"question": "What is the best way to overcome public speaking fear?", "options": ["Practice and exposure", "Avoidance"], "answer": "Practice and exposure"},
        {"question": "Which skill improves time management?", "options": ["Prioritization", "Multitasking"], "answer": "Prioritization"},
        {"question": "What does \"CV\" stand for?", "options": ["Curriculum Vitae", "Career Verification"], "answer": "Curriculum Vitae"},
        {"question": "Which platform is best for professional networking?", "options": ["LinkedIn", "Facebook"], "answer": "LinkedIn"},
        {"question": "What should be the first thing in a cover letter?", "options": ["Personalized greeting", "List of skills"], "answer": "Personalized greeting"},
        {"question": "Which career requires a CFA certification?", "options": ["Finance", "Marketing"], "answer": "Finance"},
        {"question": "What is the STAR method used for?", "options": ["Job interviews", "Project planning"], "answer": "Job interviews"},
        {"question": "Whatís the best approach to writing a CV?", "options": ["Tailor it for each job", "Use the same CV everywhere"], "answer": "Tailor it for each job"},
        {"question": "Which is a common mistake in job interviews?", "options": ["Talking too much", "Dressing formally"], "answer": "Talking too much"},
        {"question": "Which planet has the most moons?", "options": ["Saturn", "Jupiter"], "answer": "Saturn"},
        {"question": "What is the longest river in the world?", "options": ["Nile", "Amazon"], "answer": "Nile"},
        {"question": "Who discovered penicillin?", "options": ["Alexander Fleming", "Louis Pasteur"], "answer": "Alexander Fleming"},
        {"question": "Which company was originally called \"Blue Ribbon Sports\"?", "options": ["Nike", "Adidas"], "answer": "Nike"},
        {"question": "What does \"CEO\" stand for?", "options": ["Chief Executive Officer", "Corporate Executive Officer"], "answer": "Chief Executive Officer"},
        {"question": "Which gas do humans breathe out?", "options": ["Carbon Dioxide", "Nitrogen"], "answer": "Carbon Dioxide"},
        {"question": "What is the capital of France?", "options": ["Paris", "Rome"], "answer": "Paris"},
        {"question": "Which planet is closest to the Sun?", "options": ["Mercury", "Venus"], "answer": "Mercury"},
        {"question": "How many continents are there?", "options": ["7", "5"], "answer": "7"},
        {"question": "Who invented the telephone?", "options": ["Alexander Graham Bell", "Thomas Edison"], "answer": "Alexander Graham Bell"},
        {"question": "What does \"WWW\" stand for?", "options": ["World Wide Web", "Web Wide World"], "answer": "World Wide Web"},
        {"question": "Which company created the iPhone?", "options": ["Apple", "Samsung"], "answer": "Apple"},
        {"question": "What is the main purpose of a firewall?", "options": ["Block unauthorized access", "Speed up the internet"], "answer": "Block unauthorized access"},
        {"question": "Which social media platform has a \"like\" button?", "options": ["Facebook", "LinkedIn"], "answer": "Facebook"},
        {"question": "What does \"PDF\" stand for?", "options": ["Portable Document Format", "Printed Document File"], "answer": "Portable Document Format"},
        {"question": "How many players are in a soccer team?", "options": ["11", "9"], "answer": "11"},
        {"question": "Which sport uses a shuttlecock?", "options": ["Badminton", "Tennis"], "answer": "Badminton"},
        {"question": "What does \"CEO\" stand for?", "options": ["Chief Executive Officer", "Corporate Executive Officer"], "answer": "Chief Executive Officer"},
        {"question": "Which company owns YouTube?", "options": ["Google", "Microsoft"], "answer": "Google"},
        {"question": "What is the currency of Japan?", "options": ["Yen", "Won"], "answer": "Yen"},
        {"question": "Which company makes PlayStation?", "options": ["Sony", "Nintendo"], "answer": "Sony"},
        {"question": "What does \"B2C\" mean in business?", "options": ["Business to Consumer", "Brand to Customer"], "answer": "Business to Consumer"},
        {"question": "Which country hosted the 2022 FIFA World Cup?", "options": ["Qatar", "Brazil"], "answer": "Qatar"},
        {"question": "Which tech billionaire bought Twitter in 2022?", "options": ["Elon Musk", "Mark Zuckerberg"], "answer": "Elon Musk"},
        {"question": "Which global event was postponed to 2021 due to COVID-19?", "options": ["Tokyo Olympics", "FIFA World Cup"], "answer": "Tokyo Olympics"},
        {"question": "What is the best way to remember information?", "options": ["Active recall", "Rereading notes"], "answer": "Active recall"},
        {"question": "Which skill helps in teamwork?", "options": ["Collaboration", "Solo problem-solving"], "answer": "Collaboration"},
        {"question": "What does \"DIY\" stand for?", "options": ["Do It Yourself", "Design It Yourself"], "answer": "Do It Yourself"},
        {"question": "Which tool is used for online video calls?", "options": ["Zoom", "Photoshop"], "answer": "Zoom"},
        {"question": "What is a \"soft skill\"?", "options": ["Communication", "Coding"], "answer": "Communication"},
        {"question": "What is the first step in job hunting?", "options": ["Research", "Sending random emails"], "answer": "Research"},
        {"question": "Which document summarizes your skills and experience?", "options": ["Resume/CV", "Cover letter"], "answer": "Resume/CV"},
        {"question": "What should you do before a job interview?", "options": ["Practice answers", "Wing it"], "answer": "Practice answers"},
        {"question": "Which platform is best for finding internships?", "options": ["LinkedIn", "TikTok"], "answer": "LinkedIn"},
        {"question": "What is a \"networking event\"?", "options": ["Meeting professionals", "A party"], "answer": "Meeting professionals"},
        {"question": "Which animal is the fastest on land?", "options": ["Cheetah", "Lion"], "answer": "Cheetah"},
        {"question": "What is the largest ocean?", "options": ["Pacific", "Atlantic"], "answer": "Pacific"},
        {"question": "Who painted the \"Starry Night\"?", "options": ["Vincent van Gogh", "Pablo Picasso"], "answer": "Vincent van Gogh"},
        {"question": "Which country is famous for kangaroos?", "options": ["Australia", "Brazil"], "answer": "Australia"},
        {"question": "What is the main language of Brazil?", "options": ["Portuguese", "Spanish"], "answer": "Portuguese"},
        {"question": "Which planet has rings?", "options": ["Saturn", "Mars"], "answer": "Saturn"},
        {"question": "What is the capital of Canada?", "options": ["Ottawa", "Toronto"], "answer": "Ottawa"},
        {"question": "Which app is used for short videos?", "options": ["TikTok", "Facebook"], "answer": "TikTok"},
        {"question": "What does \"GPS\" stand for?", "options": ["Global Positioning System", "General Phone Service"], "answer": "Global Positioning System"},
        {"question": "Which company makes the Xbox?", "options": ["Microsoft", "Sony"], "answer": "Microsoft"},
        {"question": "What is the study of stars called?", "options": ["Astronomy", "Biology"], "answer": "Astronomy"},
        {"question": "Which country has the Eiffel Tower?", "options": ["France", "Germany"], "answer": "France"},
        {"question": "What is the largest social media platform?", "options": ["Facebook", "Twitter"], "answer": "Facebook"},
        {"question": "Which gas is used in balloons to make them float?", "options": ["Helium", "Oxygen"], "answer": "Helium"},
        {"question": "What is the capital of Spain?", "options": ["Madrid", "Barcelona"], "answer": "Madrid"}
    ];

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

    // fetch('./assets/questions.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         allQuestions = data;
    //     })
    //     .catch(error => console.error('Error loading questions:', error));

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
        progressBarElement.style.width = 0;
    
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
                // button.classList.add('pop');
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
    
            typeQuestion(`${currentQ.question}`, questionElement, animateOptionsIn);
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
