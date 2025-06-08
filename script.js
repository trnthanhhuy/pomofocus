const localClock = document.getElementById("local-clock");

async function loadPreciseClockWithIP() {
  try {
    // 1. Lấy IP public
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    const userIP = ipData.ip;

    // 2. Gọi TimeAPI với IP đó
    const res = await fetch(`https://timeapi.io/api/time/current/ip?ipAddress=${userIP}`);
    if (!res.ok) throw new Error("Không thể lấy giờ từ TimeAPI");
    const data = await res.json();

    const timezone = data.timeZone;
    const serverTime = new Date(data.dateTime);
    const clientStart = performance.now();

    function updateClock() {
      const elapsed = performance.now() - clientStart;
      const current = new Date(serverTime.getTime() + elapsed);

      const h = current.getHours().toString().padStart(2, "0");
      const m = current.getMinutes().toString().padStart(2, "0");
      const s = current.getSeconds().toString().padStart(2, "0");
      const ms = current.getMilliseconds().toString().padStart(3, "0");
      const tensMs = ms.slice(0, 2); // Lấy hàng chục ms

      localClock.textContent = ` ${h}:${m}:${s}.${tensMs} (${timezone})`;
      requestAnimationFrame(updateClock);
    }

    updateClock();
  } catch (err) {
    console.error("Lỗi đồng hồ thực:", err);
    localClock.textContent = "🕐 Không thể tải thời gian từ TimeAPI";
  }
}

loadPreciseClockWithIP();



let timer;
let isRunning = false;
let totalMs = 0; // tổng thời gian tính bằng mili giây
let endTime = 0;

const timerDisplay = document.getElementById("timer");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

function updateDisplay(msLeft = totalMs) {
  msLeft = Math.max(0, msLeft);
  const hours = Math.floor(msLeft / 3600000);
  const minutes = Math.floor((msLeft % 3600000) / 60000);
  const seconds = Math.floor((msLeft % 60000) / 1000);
  const ms = Math.floor((msLeft % 1000) / 10); // lấy 2 chữ số mili giây
  timerDisplay.textContent = 
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function calculateMsFromInputs() {
  const h = parseInt(hoursInput.value);
  const m = parseInt(minutesInput.value);
  return ((isNaN(h) ? 0 : h) * 3600 + (isNaN(m) ? 0 : m) * 60) * 1000;
}


function showStartPauseButtons(isRunning) {
  if (isRunning) {
    startBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
  } else {
    startBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
  }
}

function startTimer() {
  if (!isRunning) {
    if (totalMs === 0) {
      totalMs = calculateMsFromInputs();
    }
    endTime = Date.now() + totalMs;
    isRunning = true;
    showStartPauseButtons(true);

    function tick() {
      if (!isRunning) return;
      const msLeft = endTime - Date.now();
      updateDisplay(msLeft);
      if (msLeft > 0) {
        timer = requestAnimationFrame(tick);
      } else {
        updateDisplay(0);
        isRunning = false;
        showStartPauseButtons(false);
        alert("⏰ Hết giờ rồi! Chúc bạn nghỉ ngơi vui vẻ 🛋️");
      }
    }
    tick();
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    cancelAnimationFrame(timer);
    totalMs = Math.max(0, endTime - Date.now());
    updateDisplay(totalMs);
    showStartPauseButtons(false);
  }
}

function resetTimer() {
  isRunning = false;
  cancelAnimationFrame(timer);
  totalMs = calculateMsFromInputs();
  updateDisplay(totalMs);
  showStartPauseButtons(false);
}



showStartPauseButtons(false);
// Tự cập nhật hiển thị khi nhập giờ hoặc phút
[hoursInput, minutesInput].forEach(input => {
  input.addEventListener("input", () => {
    if (!isRunning) {
      totalMs = calculateMsFromInputs();
      updateDisplay(totalMs);
    }
  });
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

resetTimer(); // khởi tạo ban đầu
// ...existing code...