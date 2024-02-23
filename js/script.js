const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');

openModal.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

const timerForm = document.getElementById('timerForm');

timerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const duration = document.getElementById('duration').value;

    const timer = {
        taskName: taskName,
        duration: duration,
        timestamp: new Date().toISOString()
    };

    const timers = JSON.parse(localStorage.getItem('timers')) || [];

    // Add the new timer to the array of timers
    timers.push(timer);

    // Save the updated array back to localStorage
    localStorage.setItem('timers', JSON.stringify(timers));

    // clear the form fields
    timerForm.reset();

    // Hide the modal
    modal.classList.add('hidden');
    displayTimers();
});

document.addEventListener('DOMContentLoaded', () => {
    displayTimers();
});

function displayTimers() {
    const timersList = document.getElementById('timersList');
    timersList.innerHTML = ''; // Clear existing timers display

    // Retrieve timers from localStorage
    const timers = JSON.parse(localStorage.getItem('timers')) || [];

    // Check if there are any timers to display
    if (timers.length === 0) {
        timersList.innerHTML = '<p class="text-white">No timers saved.</p>';
        return;
    }

    timers.forEach((timer, index) => {
        const timerEl = document.createElement('div');
        timerEl.className = 'bg-gray-100 rounded-lg p-5 shadow flex flex-col space-y-2';
        timerEl.innerHTML = `
            <div class="flex justify-between">
                <div class="flex items-center">
                    <i class="fa-solid fa-list-check"></i>
                    <h3 class="pl-3 text-lg font-semibold">${timer.taskName}</h3>
                </div>
                <div>
                    <button id="edit-${index}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                    <i class="fa-regular fa-pen-to-square"></i>
                        Edit
                    </button>
                    <button id="delete-${index}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
                    <i class="fa-regular fa-trash-can"></i>
                        Delete
                    </button>
                </div>
            </div>
            <p class="text-2xl" id="duration-${index}">${timer.duration} minute(s)</p>
            <div class="flex space-x-2">
                <button id="start-${index}" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded shadow-lg border border-green-600"><i class="fa-solid fa-play mx-2"></i>Start Timer</button>
                <button id="pause-${index}" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded shadow-lg border border-yellow-600 hidden"><i class="fa-solid fa-pause mx-2"></i>Pause</button>
                <button id="reset-${index}" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded shadow-lg border border-red-600 hidden"><i class="fa-solid fa-rotate-left mx-2"></i>Reset</button>
            </div>
        `;
        timersList.appendChild(timerEl);

        setupTimerControls(index, timer.duration);
        setupEditAndDeleteButtons(index);
    });

    function setupTimerControls(index, duration) {
        let countdown;
        let time = duration * 60; // Convert minutes to seconds
        let isRunning = false;

        const startButton = document.getElementById(`start-${index}`);
        const pauseButton = document.getElementById(`pause-${index}`);
        const resetButton = document.getElementById(`reset-${index}`);
        const durationElement = document.getElementById(`duration-${index}`);

        const updateDurationDisplay = () => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            durationElement.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        const startTimer = () => {
            if (!isRunning) {
                countdown = setInterval(() => {
                    if (time <= 0) {
                        clearInterval(countdown);
                        durationElement.innerHTML = 'Time’s up!';
                        playSound();
                        resetControls();
                    } else {
                        time--;
                        updateDurationDisplay();
                    }
                }, 1000);
                isRunning = true;
                startButton.classList.add('hidden');
                pauseButton.classList.remove('hidden');
                resetButton.classList.remove('hidden');
            }
        };

        const pauseTimer = () => {
            if (isRunning) {
                clearInterval(countdown);
                isRunning = false;
                startButton.innerHTML = 'Resume';
                startButton.classList.remove('hidden');
                pauseButton.classList.add('hidden');
            }
        };

        const resetTimer = () => {
            clearInterval(countdown);
            time = duration * 60;
            isRunning = false;
            updateDurationDisplay();
            resetControls();
        };

        const resetControls = () => {
            startButton.innerHTML = '<i class="fa-solid fa-play mx-2"></i>Start Timer';
            pauseButton.classList.add('hidden');
            resetButton.classList.add('hidden');
            startButton.classList.remove('hidden');
        };

        startButton.addEventListener('click', startTimer);
        pauseButton.addEventListener('click', pauseTimer);
        resetButton.addEventListener('click', resetTimer);
    }

    function playSound() {
        const audio = new Audio('assets/sounds/finish.wav');
        audio.play();
    }
}

function setupEditAndDeleteButtons(index) {
    const editButton = document.getElementById(`edit-${index}`);
    const deleteButton = document.getElementById(`delete-${index}`);

    editButton.addEventListener('click', () => {
        const timers = JSON.parse(localStorage.getItem('timers')) || [];
        const timer = timers[index];

        const newTaskName = prompt('Edit Task Name:', timer.taskName);
        const newDuration = prompt('Edit Duration (minutes):', timer.duration);

        if (newTaskName !== null && newDuration !== null) {
            timer.taskName = newTaskName;
            timer.duration = newDuration;
            localStorage.setItem('timers', JSON.stringify(timers));
            displayTimers();
        }
    });

    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this timer?')) {
            const timers = JSON.parse(localStorage.getItem('timers')) || [];
            timers.splice(index, 1); // Remove the timer from the array
            localStorage.setItem('timers', JSON.stringify(timers));
            displayTimers();
        }
    });
}
