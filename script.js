// Аудио элементы
const bgMusic = document.getElementById("bg-music");
// Элементы аудиоплеера закомментированы, так как их нет в index.html.
// Если добавите их, раскомментируйте и реализуйте логику.
// const audioPlayer = document.getElementById("audioPlayer");
// const playPauseBtn = document.getElementById("playPauseBtn");
// const prevBtn = document.getElementById("prevBtn");
// const nextBtn = document.getElementById("nextBtn");
// const musicTitle = document.querySelector(".music-title");
// const musicCover = document.querySelector(".music-cover");

// --- Функции для эффектов ---

// Взрыв конфетти
function launchConfetti() {
  if (typeof confetti === 'undefined') { //
    console.warn("Confetti library not loaded. Make sure confetti.browser.min.js is included."); //
    return; //
  }
  const myConfetti = confetti.create(document.getElementById('confetti-canvas'), { //
    resize: true, //
    useWorker: true //
  });

  myConfetti({ //
    particleCount: 200, //
    spread: 120, //
    origin: { y: 0.6 }, //
    colors: ['#ffc0cb', '#d8bfd8', '#a8f0ff', '#ffffff'] //
  });

  myConfetti({ //
    particleCount: 100, //
    spread: 90, //
    origin: { x: 0.1, y: 0.7 }, //
    colors: ['#ffc0cb', '#d8bfd8', '#a8f0ff', '#ffffff'] //
  });
  myConfetti({ //
    particleCount: 100, //
    spread: 90, //
    origin: { x: 0.9, y: 0.7 }, //
    colors: ['#ffc0cb', '#d8bfd8', '#a8f0ff', '#ffffff'] //
  });
}

// Падающие сердечки/сакура
const fallingItems = ['❤️', '🌸']; //
let fallingInterval; //

function startFallingItems() { //
  stopFallingItems(); //
  fallingInterval = setInterval(() => { //
    const item = document.createElement('div'); //
    item.classList.add('falling-item'); //
    item.textContent = fallingItems[Math.floor(Math.random() * fallingItems.length)]; //
    item.style.left = `${Math.random() * 100}vw`; //
    item.style.fontSize = `${Math.random() * 20 + 15}px`; //
    item.style.animationDuration = `${Math.random() * 5 + 5}s`; //

    document.body.appendChild(item); //

    item.addEventListener('animationend', () => { //
      item.remove(); //
    });
  }, 300); //
}

function stopFallingItems() { //
  clearInterval(fallingInterval); //
  document.querySelectorAll('.falling-item').forEach(item => item.remove()); //
}

// Функции для фоновой музыки
function playBgMusic() { //
  if (bgMusic) { //
    bgMusic.play().catch(e => console.error("Error playing background music:", e)); //
  }
}

function stopBgMusic() { //
  if (bgMusic) { //
    bgMusic.pause(); //
    bgMusic.currentTime = 0; // Reset to start
  }
}

// Заглушка для функции паузы трека плеера (если плеер отсутствует)
function pauseCurrentTrack() {
  // Логика паузы трека плеера, если он будет добавлен.
}


// --- Дата Дня Рождения Алисы (Месяц и День) ---
const BIRTHDAY_MONTH = 4; // Май (месяцы начинаются с 0, так что 4 = май)
const BIRTHDAY_DAY = 19; // 19 число

// Глобальная переменная для отслеживания состояния Дня Рождения
let isBirthdayToday = false; //


// --- Массив с разными вариантами поздравлений ---
// Используем '\n' для переносов строк, чтобы typeWriter и white-space: pre-wrap; работали корректно.
const greetings = [ //
  `Дорогая Алиса!\n\n
С Днём Рождения тебя, солнце ☀️\n
Пусть в жизни будет больше света, тепла, любви и волшебства.\n
Ты делаешь этот мир ярче, просто оставаясь собой.\n
Я бесконечно рад, что ты есть.\n\n
Никогда не переставай мечтать — ты достойна самого лучшего💗\n\n
С любовью и самыми тёплыми пожеланиями 💫\n\n`, //

  `Моя чудесная Алиса!\n\n
С Днём Рождения! Пусть каждый твой день будет наполнен радостью,
улыбками и вдохновением. Желаю тебе исполнения самых заветных желаний,
невероятных приключений и искренней любви.\n\n
Будь счастлива, сияй ярче звёзд!\n\n
Обнимаю крепко! ✨\n\n`, //

  `С Днём Рождения, Алиса!\n\n
Сегодня твой день, и пусть он будет таким же особенным,
как и ты! Желаю тебе невероятного счастья, здоровья,
успехов во всех начинаниях и чтобы рядом всегда были
только самые близкие и любящие люди.\n\n
Ты невероятная! ❤️\n\n`, //

  `Алиса, с праздником!\n\n
Пусть этот год принесёт тебе много новых открытий,
ярких моментов и незабываемых впечатлений. Желаю, чтобы
все твои мечты сбывались, а жизнь была полна гармонии
и позитивных эмоций.\n\n
Всего самого наилучшего! 🎉\n\n` //
];


// --- Кнопка «Открыть поздравление» ---
document.getElementById("openBtn").addEventListener("click", () => { //
  vibrate(); //
  document.getElementById("main-buttons").classList.add("hidden"); //
  document.getElementById("mainMessage").classList.add("show"); //
  document.getElementById("backBtn").classList.remove("hidden"); //

  const messageParagraph = document.querySelector("#mainMessage p"); //
  
  if (!isBirthdayToday) { // Если День Рождения еще не наступил, используем глобальную переменную
    const today = new Date(); // Пересчитываем для дней, чтобы заглушка была актуальной
    const currentYear = today.getFullYear(); //
    const birthdayThisYear = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY); //
    today.setHours(0, 0, 0, 0); //
    birthdayThisYear.setHours(0, 0, 0, 0); //
    let nextBirthdayYear = currentYear; //
    if (today > birthdayThisYear) { //
        nextBirthdayYear = currentYear + 1; //
    }
    const nextBirthday = new Date(nextBirthdayYear, BIRTHDAY_MONTH, BIRTHDAY_DAY); //
    nextBirthday.setHours(0, 0, 0, 0); //

    const remainingDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)); //
    
    // Clear any previous typewriter effect before starting a new one
    if (typeWriterTimeout) { //
        clearTimeout(typeWriterTimeout); //
        typeWriterTimeout = null; //
    }
    messageParagraph.innerHTML = ""; // Ensure the paragraph is truly empty

    // Заглушка для текста
    const fallbackText = `
      <span style="font-size: 0.85em; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
        Ой, ты сюда попала слишком рано!<br>
        Осталось ${remainingDays} дней 
      </span>
    `;
    typeWriter(messageParagraph, fallbackText, 50); // Используем typeWriter для плавной печати заглушки

    stopBgMusic(); //
    stopFallingItems(); //
    pauseCurrentTrack(); //
  } else {
    // Если сегодня День Рождения или уже после (т.е. заглушка не нужна)
    const randomIndex = Math.floor(Math.random() * greetings.length); //
    const selectedGreeting = greetings[randomIndex]; //
    typeWriter(messageParagraph, selectedGreeting, 50); // Плавная печать поздравления
    playBgMusic(); //
    launchConfetti(); //
    startFallingItems(); //
    pauseCurrentTrack(); //
  }
});

// --- Секретное слово ---
document.getElementById("check-secret").addEventListener("click", () => { //
  vibrate(); //
  const value = document.getElementById("secret-input").value.trim().toLowerCase(); //
  const div = document.getElementById("secret-message"); //

  document.getElementById("main-buttons").classList.add("hidden"); //
  div.style.display = 'block'; //
  document.getElementById("backBtn").classList.remove("hidden"); //

  // Clear any previous typewriter effect if it was active
  if (typeWriterTimeout) { //
      clearTimeout(typeWriterTimeout); //
      typeWriterTimeout = null; //
  }
  div.innerHTML = ""; // Clear the secret message div too

  if (value === "чудо" || value === "ты моё чудо") { //
    div.innerHTML = "🎉 Ты ввела секретное слово: ты моё чудо! 💖"; //
  } else {
    div.innerHTML = "😅 Неверное слово. Попробуй снова!"; //
  }
  stopBgMusic(); //
  stopFallingItems(); //
  pauseCurrentTrack(); //
});

// --- Кнопка «Музыка» (закомментировано, так как нет в HTML) ---
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
    stopBgMusic();
    stopFallingItems();
  });
}
*/


// --- Кнопка «Назад» ---
document.getElementById("backBtn").addEventListener("click", () => { //
  vibrate(); //
  document.getElementById("main-buttons").classList.remove("hidden"); //
  document.getElementById("mainMessage").classList.remove("show"); //
  document.getElementById("secret-message").style.display = "none"; //
  // Если у вас есть musicPlayer, раскомментируйте эту строку:
  // if (document.getElementById("musicPlayer")) { //
  //   document.getElementById("musicPlayer").classList.add("hidden"); //
  // }
  document.getElementById("backBtn").classList.add("hidden"); //
  
  pauseCurrentTrack(); //
  stopBgMusic(); //
  stopFallingItems(); //

  // Crucially, stop the typewriter effect when going back
  if (typeWriterTimeout) { //
      clearTimeout(typeWriterTimeout); //
      typeWriterTimeout = null; //
  }
  document.querySelector("#mainMessage p").innerHTML = ""; // Clear the content immediately
});

// --- Печать текста по буквам ---
let typeWriterTimeout = null; // Инициализируем null

function typeWriter(element, text, speed) { //
  // Clear any existing timeout to prevent multiple concurrent animations
  if (typeWriterTimeout) { //
    clearTimeout(typeWriterTimeout); //
    typeWriterTimeout = null; // Reset to null after clearing
  }

  element.innerHTML = ""; // Ensure the element is completely empty before starting
  let i = 0; //
  // text.split('') уже достаточно, т.к. greetings теперь с '\n'
  const chars = text.split(''); //

  function type() { //
    if (i < chars.length) { //
      // Replace '\n' with '<br>' directly as we iterate through plain characters
      element.innerHTML += (chars[i] === '\n' ? '<br>' : chars[i]); //
      i++; //
      typeWriterTimeout = setTimeout(type, speed); //
    } else {
      typeWriterTimeout = null; // Clear timeout when typing is complete
    }
  }
  type(); //
}


// --- Инициализация при загрузке ---
document.addEventListener('DOMContentLoaded', () => { //
  // initAudio(); // Закомментировано, т.к. audioPlayer не определен в предоставленном коде.
  
  // Проверяем дату при загрузке страницы и устанавливаем заголовок
  const today = new Date(); //
  const currentYear = today.getFullYear(); //
  const birthdayThisYear = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY); //
  today.setHours(0, 0, 0, 0); //
  birthdayThisYear.setHours(0, 0, 0, 0); //

  let nextBirthdayYear = currentYear; //
  if (today > birthdayThisYear) { //
      nextBirthdayYear = currentYear + 1; //
  }
  const nextBirthday = new Date(nextBirthdayYear, BIRTHDAY_MONTH, BIRTHDAY_DAY); //
  nextBirthday.setHours(0, 0, 0, 0); //

  if (today.getTime() === birthdayThisYear.getTime()) { // Сегодня День Рождения
      isBirthdayToday = true; //
      document.title = "С Днём Рождения, Алиса!"; //
  } else if (today < nextBirthday) { // День Рождения еще не наступил
      isBirthdayToday = false; //
      document.title = "Скоро День Рождения Алисы!"; //
  } else { // День Рождения уже прошел в этом году (и не сегодня)
      isBirthdayToday = true; // Считаем, что День Рождения прошел, показываем обычное поздравление
      document.title = "С Днём Рождения, Алиса!"; //
  }


  // Разблокировка аудио по первому клику
  document.body.addEventListener('click', () => { //
    // Если у вас появится audioPlayer, раскомментируйте эту строку:
    // if (audioPlayer) audioPlayer.play().then(() => audioPlayer.pause()).catch(e => console.warn("Audio activation failed:", e));
    if (bgMusic) bgMusic.play().then(() => bgMusic.pause()).catch(e => console.warn("Background audio activation failed:", e)); //
  }, { once: true }); //

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
function vibrate(duration = 100) { //
    if ('vibrate' in navigator) navigator.vibrate(duration); //
}
