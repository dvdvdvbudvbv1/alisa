// Аудио элементы
const bgMusic = document.getElementById("bg-music");
// Аудио плеер и его элементы закомментированы, так как их нет в вашем index.html.
// Если вы добавите их позже, раскомментируйте и реализуйте соответствующую логику.
// const audioPlayer = document.getElementById("audioPlayer");
// const playPauseBtn = document.getElementById("playPauseBtn");
// const prevBtn = document.getElementById("prevBtn");
// const nextBtn = document.getElementById("nextBtn");
// const musicTitle = document.querySelector(".music-title");
// const musicCover = document.querySelector(".music-cover");

// --- Функции для эффектов ---

// Взрыв конфетти
function launchConfetti() {
  // Проверяем, что библиотека confetti загружена
  if (typeof confetti === 'undefined') {
    console.warn("Confetti library not loaded. Make sure confetti.browser.min.js is included.");
    return;
  }
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

// Функции для фоновой музыки
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

// Заглушка для функции паузы трека плеера (если плеер отсутствует)
function pauseCurrentTrack() {
  // Если у вас появится аудиоплеер, здесь будет логика его паузы.
  // Например: if (audioPlayer) audioPlayer.pause();
}


// --- Дата Дня Рождения Алисы (Месяц и День) ---
const BIRTHDAY_MONTH = 4; // Май (месяцы начинаются с 0, так что 4 = май)
const BIRTHDAY_DAY = 19; // 19 число


// --- Массив с разными вариантами поздравлений ---
// Используем '\n' для переносов строк, чтобы typeWriter и white-space: pre-wrap; работали корректно.
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
    // Здесь используем <br> напрямую, т.к. это статичный HTML, не для typeWriter.
    // Обернул текст в <span>, чтобы стили P из CSS применялись, а не переопределялись.
    messageParagraph.innerHTML = `
      <span style="font-size: 1.2em; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
        Ой, ты сюда попал слишком рано!<br>
        Возвращайся в День Рождения Алисы!<br><br>
        Осталось ${remainingDays} дней... 🤫
      </span>
    `;
    stopBgMusic();
    stopFallingItems();
    pauseCurrentTrack();
  } else {
    // Если сегодня День Рождения или уже после (т.е. заглушка не нужна)
    const randomIndex = Math.floor(Math.random() * greetings.length);
    const selectedGreeting = greetings[randomIndex];
    // Используем typeWriter, который теперь корректно обрабатывает \n
    typeWriter(messageParagraph, selectedGreeting, 50);
    playBgMusic();
    launchConfetti();
    startFallingItems();
    pauseCurrentTrack();
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
  stopBgMusic();
  stopFallingItems();
  pauseCurrentTrack();
});

// --- Кнопка «Музыка» ---
// Эта секция закомментирована, так как HTML-элементы для неё отсутствуют в предоставленном index.html.
// Если вы добавите их, раскомментируйте этот блок и реализуйте нужную логику.
/*
if (document.getElementById("musicBtn")) {
  document.getElementById("musicBtn").addEventListener("click", () => {
    vibrate();
    document.getElementById("main-buttons").classList.add("hidden");
    if (document.getElementById("musicPlayer")) {
      document.getElementById("musicPlayer").classList.remove("hidden");
    }
    document.getElementById("backBtn").classList.remove("hidden");
    
    // Обновляем состояние кнопки play/pause, если она есть
    // if (playPauseBtn) playPauseBtn.textContent = isPlaying ? "⏸" : "▶️";
    stopBgMusic(); // Останавливаем фоновую музыку при открытии плеера
    stopFallingItems(); // Останавливаем эффекты, если случайно запустились
  });
}
*/


// --- Кнопка «Назад» ---
document.getElementById("backBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.remove("hidden");
  document.getElementById("mainMessage").classList.remove("show");
  document.getElementById("secret-message").style.display = "none";
  // Если у вас есть musicPlayer, раскомментируйте эту строку:
  // if (document.getElementById("musicPlayer")) {
  //   document.getElementById("musicPlayer").classList.add("hidden");
  // }
  document.getElementById("backBtn").classList.add("hidden");
  
  pauseCurrentTrack(); 
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
  // text.split('') уже достаточно, т.к. greetings теперь с '\n'
  const chars = text.split(''); 

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
  // initAudio(); // Закомментировано, т.к. audioPlayer не определен в предоставленном коде.
  
  // Разблокировка аудио по первому клику
  document.body.addEventListener('click', () => {
    // Если у вас появится audioPlayer, раскомментируйте эту строку:
    // if (audioPlayer) audioPlayer.play().then(() => audioPlayer.pause()).catch(e => console.warn("Audio activation failed:", e));
    if (bgMusic) bgMusic.play().then(() => bgMusic.pause()).catch(e => console.warn("Background audio activation failed:", e));
  }, { once: true });

  // Обработчики для кнопок плеера (закомментированы, если их нет в HTML)
  /*
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      vibrate();
      isPlaying ? pauseCurrentTrack() : playCurrentTrack();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      vibrate();
      playPrevTrack();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      vibrate();
      playNextTrack();
    });
  }
  if (audioPlayer) {
    audioPlayer.addEventListener('ended', playNextTrack);
  }
  */
});

// Функция вибрации
function vibrate(duration = 100) {
    if ('vibrate' in navigator) navigator.vibrate(duration);
}
