// Аудио элементы
const bgMusic = document.getElementById("bg-music");
// Note: audioPlayer, playPauseBtn, prevBtn, nextBtn, musicTitle, musicCover are not present in index.html for the provided snippet,
// so their functionality will not be active or will cause errors if elements are missing.
// Assuming these are part of a larger application not fully provided.
// For this specific issue (text corruption), these are not directly relevant.
// Removed them from this solution for clarity, but keep them in your full code if needed.


// --- Функции для эффектов ---

// Взрыв конфетти
function launchConfetti() {
  const myConfetti = confetti.create(document.getElementById('confetti-canvas'), {
    resize: true,
    useWorker: true
  });

  myConfetti({
    particleCount: 200,
    spread: 120,
    origin: { y: 0.6 },
    colors: ['#ffc0cb', '#d8bfd8', '#a8f0ff', '#ffffff']
  });

  myConfetti({
    particleCount: 100,
    spread: 90,
    origin: { x: 0.1, y: 0.7 },
    colors: ['#ffc0cb', '#d8bfd8', '#a8f0ff', '#ffffff']
  });
  myConfetti({
    particleCount: 100,
    spread: 90,
    origin: { x: 0.9, y: 0.7 },
    colors: ['#ffc0cb', '#d8bfd8', '#a8f0ff', '#ffffff']
  });
}

// Падающие сердечки/сакура
const fallingItems = ['❤️', '🌸'];
let fallingInterval;

function startFallingItems() {
  // Останавливаем предыдущий интервал, если он есть, чтобы избежать множественных запусков
  stopFallingItems();
  fallingInterval = setInterval(() => {
    const item = document.createElement('div');
    item.classList.add('falling-item');
    item.textContent = fallingItems[Math.floor(Math.random() * fallingItems.length)];
    item.style.left = `${Math.random() * 100}vw`;
    item.style.fontSize = `${Math.random() * 20 + 15}px`;
    item.style.animationDuration = `${Math.random() * 5 + 5}s`;

    document.body.appendChild(item);

    item.addEventListener('animationend', () => {
      item.remove();
    });
  }, 300);
}

function stopFallingItems() {
  clearInterval(fallingInterval);
  document.querySelectorAll('.falling-item').forEach(item => item.remove());
}

// Placeholder for music functions, as they are not fully provided in the HTML/CSS
function playBgMusic() {
  if (bgMusic) {
    bgMusic.play().catch(e => console.error("Error playing background music:", e));
  }
}

function stopBgMusic() {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0; // Reset to start
  }
}

function pauseCurrentTrack() {
  // Assuming audioPlayer exists in your full code
  // if (audioPlayer) {
  //   audioPlayer.pause();
  //   isPlaying = false;
  //   if (playPauseBtn) playPauseBtn.textContent = "▶️";
  // }
}


// --- Дата Дня Рождения Алисы (Месяц и День) ---
const BIRTHDAY_MONTH = 4; // Май (месяцы начинаются с 0, так что 4 = май)
const BIRTHDAY_DAY = 19; // 19 число


// --- Массив с разными вариантами поздравлений ---
// Changed to use plain text and let typeWriter handle line breaks (or just set innerHTML directly for simplicity)
const greetings = [
  `Дорогая Алиса!\n\n
С Днём Рождения тебя, солнце ☀️\n
Пусть в жизни будет больше света, тепла, любви и волшебства.\n
Ты делаешь этот мир ярче, просто оставаясь собой.\n
Я бесконечно рад, что ты есть.\n\n
Никогда не переставай мечтать — ты достойна самого лучшего💗\n\n
С любовью и самыми тёплыми пожеланиями 💫\n\n`,

  `Моя чудесная Алиса!\n\n
С Днём Рождения! Пусть каждый твой день будет наполнен радостью,
улыбками и вдохновением. Желаю тебе исполнения самых заветных желаний,
невероятных приключений и искренней любви.\n\n
Будь счастлива, сияй ярче звёзд!\n\n
Обнимаю крепко! ✨\n\n`,

  `С Днём Рождения, Алиса!\n\n
Сегодня твой день, и пусть он будет таким же особенным,
как и ты! Желаю тебе невероятного счастья, здоровья,
успехов во всех начинаниях и чтобы рядом всегда были
только самые близкие и любящие люди.\n\n
Ты невероятная! ❤️\n\n`,

  `Алиса, с праздником!\n\n
Пусть этот год принесёт тебе много новых открытий,
ярких моментов и незабываемых впечатлений. Желаю, чтобы
все твои мечты сбывались, а жизнь была полна гармонии
и позитивных эмоций.\n\n
Всего самого наилучшего! 🎉\n\n`
];


// --- Кнопка «Открыть поздравление» ---
document.getElementById("openBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.add("hidden");
  document.getElementById("mainMessage").classList.add("show");
  document.getElementById("backBtn").classList.remove("hidden");

  const messageParagraph = document.querySelector("#mainMessage p");
  const today = new Date();
  const currentYear = today.getFullYear();

  // Создаем объект Date для Дня Рождения в текущем году
  const birthdayThisYear = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
  // Обнуляем время для точного сравнения только по дате
  today.setHours(0, 0, 0, 0);
  birthdayThisYear.setHours(0, 0, 0, 0);

  // Определяем дату Дня Рождения в следующем году, если текущий уже прошел
  let nextBirthdayYear = currentYear;
  if (today > birthdayThisYear) {
      nextBirthdayYear = currentYear + 1;
  }
  const nextBirthday = new Date(nextBirthdayYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
  nextBirthday.setHours(0, 0, 0, 0);

  // Clear any previous typewriter effect before starting a new one
  if (typeWriterTimeout) {
      clearTimeout(typeWriterTimeout);
      typeWriterTimeout = null;
  }
  messageParagraph.innerHTML = ""; // Ensure the paragraph is truly empty

  if (today < nextBirthday) { // Проверяем, наступил ли уже День Рождения
    // Если сегодня раньше Дня Рождения
    const remainingDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    messageParagraph.innerHTML = `
      <p style="font-size: 1.2em; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
        Ой, ты сюда попал слишком рано!<br>
        Возвращайся в День Рождения Алисы!<br><br>
        Осталось ${remainingDays} дней... 🤫
      </p>
    `;
    stopBgMusic();
    stopFallingItems();
    pauseCurrentTrack(); // Останавим музыку плеера, если она играет
  } else {
    // Если сегодня День Рождения или уже после (т.е. заглушка не нужна)
    const randomIndex = Math.floor(Math.random() * greetings.length);
    const selectedGreeting = greetings[randomIndex];
    // Use the updated typeWriter which handles plain text with \n
    typeWriter(messageParagraph, selectedGreeting, 50);
    playBgMusic();
    launchConfetti();
    startFallingItems();
    pauseCurrentTrack(); // Останавим музыку плеера, если она играет
  }
});

// --- Секретное слово ---
document.getElementById("check-secret").addEventListener("click", () => {
  vibrate();
  const value = document.getElementById("secret-input").value.trim().toLowerCase();
  const div = document.getElementById("secret-message");

  document.getElementById("main-buttons").classList.add("hidden");
  div.style.display = 'block';
  document.getElementById("backBtn").classList.remove("hidden");

  // Clear any previous typewriter effect if it was active
  if (typeWriterTimeout) {
      clearTimeout(typeWriterTimeout);
      typeWriterTimeout = null;
  }
  div.innerHTML = ""; // Clear the secret message div too

  if (value === "чудо" || value === "ты моё чудо") {
    div.innerHTML = "🎉 Ты ввела секретное слово: ты моё чудо! 💖";
  } else {
    div.innerHTML = "😅 Неверное слово. Попробуй снова!";
  }
  stopBgMusic(); // Останавим фоновую музыку, если она играет
  stopFallingItems(); // Останавливаем эффекты, если случайно запустились
  pauseCurrentTrack(); // Останавим музыку плеера, если она играет
});

// --- Кнопка «Музыка» ---
// Placeholder if you add these buttons in index.html
// document.getElementById("musicBtn").addEventListener("click", () => {
//   vibrate();
//   document.getElementById("main-buttons").classList.add("hidden");
//   document.getElementById("musicPlayer").classList.remove("hidden");
//   document.getElementById("backBtn").classList.remove("hidden");
  
//   // Обновляем состояние кнопки play/pause
//   // playPauseBtn.textContent = isPlaying ? "⏸" : "▶️";
//   stopBgMusic(); // Останавим фоновую музыку при открытии плеера
//   stopFallingItems(); // Останавливаем эффекты, если случайно запустились
// });


// --- Кнопка «Назад» ---
document.getElementById("backBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.remove("hidden");
  document.getElementById("mainMessage").classList.remove("show");
  document.getElementById("secret-message").style.display = "none";
  // document.getElementById("musicPlayer").classList.add("hidden"); // Uncomment if you add musicPlayer
  document.getElementById("backBtn").classList.add("hidden");
  
  pauseCurrentTrack(); // Will only work if audioPlayer exists
  stopBgMusic();
  stopFallingItems(); // Останавливаем падающие элементы при возврате

  // Crucially, stop the typewriter effect when going back
  if (typeWriterTimeout) {
      clearTimeout(typeWriterTimeout);
      typeWriterTimeout = null;
  }
  document.querySelector("#mainMessage p").innerHTML = ""; // Clear the content immediately
});

// --- Печать текста по буквам ---
let typeWriterTimeout = null; // Initialize to null

function typeWriter(element, text, speed) {
  // Clear any existing timeout to prevent multiple concurrent animations
  if (typeWriterTimeout) {
    clearTimeout(typeWriterTimeout);
    typeWriterTimeout = null; // Reset to null after clearing
  }

  element.innerHTML = ""; // Ensure the element is completely empty before starting
  let i = 0;
  const chars = text.split(''); // Convert text to an array of characters for easier iteration

  function type() {
    if (i < chars.length) {
      // Replace '\n' with '<br>' directly as we iterate through plain characters
      element.innerHTML += (chars[i] === '\n' ? '<br>' : chars[i]);
      i++;
      typeWriterTimeout = setTimeout(type, speed);
    } else {
      typeWriterTimeout = null; // Clear timeout when typing is complete
    }
  }
  type();
}


// --- Инициализация при загрузке ---
document.addEventListener('DOMContentLoaded', () => {
  // initAudio(); // Removed as audioPlayer related elements are not in the provided index.html
  
  // Разблокировка аудио по первому клику
  document.body.addEventListener('click', () => {
    // if (audioPlayer) audioPlayer.play().then(() => audioPlayer.pause()).catch(e => console.warn("Audio activation failed:", e));
    if (bgMusic) bgMusic.play().then(() => bgMusic.pause()).catch(e => console.warn("Background audio activation failed:", e));
  }, { once: true });
});

// Vibraion function (keep it)
function vibrate(duration = 100) {
    if ('vibrate' in navigator) navigator.vibrate(duration);
}

// NOTE: Audio player related event listeners (playPauseBtn, prevBtn, nextBtn, audioPlayer.addEventListener('ended'))
// are commented out or not included as the necessary HTML elements for them were not in your provided index.html.
// Please ensure you have those elements in your index.html if you want the audio player to function.
