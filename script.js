let time = 25 * 60;
let timer;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function startTimer() {
  if (!isRunning) {
    timer = setInterval(() => {
      if (time > 0) {
        time--;
        updateDisplay();
      } else {
        clearInterval(timer);
        alert("⏰ Hết giờ rồi! Nghỉ ngơi chút nha 😌");
      }
    }, 1000);
    isRunning = true;
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  time = 25 * 60;
  updateDisplay();
  isRunning = false;
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
