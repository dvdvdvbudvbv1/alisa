// Аудио элементы
const bgMusic = document.getElementById("bg-music");

// Фоновая музыка
function playBgMusic() {
  bgMusic.play()
    .then(() => console.log("Background music playing"))
    .catch(e => console.error("BG music play error:", e));
}

function stopBgMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

// Вибрация
function vibrate(duration = 100) {
  if ('vibrate' in navigator) navigator.vibrate(duration);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  // Разблокировка аудио по первому клику
  document.body.addEventListener('click', () => {
    bgMusic.play().then(() => bgMusic.pause());
  }, { once: true });
});

// --- Функции для эффектов ---

// Взрыв конфетти
function launchConfetti() {
  // Используем модуль confetti, который мы подключили через CDN
  const myConfetti = confetti.create(document.getElementById('confetti-canvas'), {
    resize: true,
    useWorker: true
  });

  myConfetti({
    particleCount: 200, // Количество конфетти
    spread: 120, // Разброс
    origin: { y: 0.6 }, // Откуда летят (немного выше центра)
    colors: ['#ffc0cb', '#d8bfd8', '#a8f0ff', '#ffffff'] // Цвета конфетти
  });

  // Дополнительный выстрел конфетти сбоку для "взрыва"
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
const fallingItems = ['❤️', '🌸']; // Можно добавить больше эмодзи
let fallingInterval;

function startFallingItems() {
  fallingInterval = setInterval(() => {
    const item = document.createElement('div');
    item.classList.add('falling-item');
    item.textContent = fallingItems[Math.floor(Math.random() * fallingItems.length)];
    item.style.left = `${Math.random() * 100}vw`; // Случайная позиция по горизонтали
    item.style.fontSize = `${Math.random() * 20 + 15}px`; // Случайный размер
    item.style.animationDuration = `${Math.random() * 5 + 5}s`; // Случайная продолжительность падения

    document.body.appendChild(item);

    // Удаляем элемент после завершения анимации
    item.addEventListener('animationend', () => {
      item.remove();
    });
  }, 300); // Генерируем новый элемент каждые 300мс
}

function stopFallingItems() {
  clearInterval(fallingInterval);
  // Удаляем все оставшиеся падающие элементы
  document.querySelectorAll('.falling-item').forEach(item => item.remove());
}

// --- Дата Дня Рождения Алисы (Месяц и День) ---
// Установите месяц и день рождения Алисы здесь (Месяц (0-11), День)
const BIRTHDAY_MONTH = 4; // Май (месяцы начинаются с 0, так что 4 = май)
const BIRTHDAY_DAY = 19; // 19 число

// --- Массив с разными вариантами поздравлений ---
const greetings = [
  `Дорогая Алиса!<br><br>
С Днём Рождения тебя, солнце ☀️<br>
Пусть в жизни будет больше света, тепла, любви и волшебства.<br>
Ты делаешь этот мир ярче, просто оставаясь собой.<br>
Я бесконечно рад, что ты есть.<br><br>
Никогда не переставай мечтать — ты достойна самого лучшего💗<br><br>
С любовью и самыми тёплыми пожеланиями 💫<br><br>`,

  `Моя чудесная Алиса!<br><br>
С Днём Рождения! Пусть каждый твой день будет наполнен радостью,
улыбками и вдохновением. Желаю тебе исполнения самых заветных желаний,
невероятных приключений и искренней любви.<br><br>
Будь счастлива, сияй ярче звёзд!<br><br>
Обнимаю крепко! ✨<br><br>`,

  `С Днём Рождения, Алиса!<br><br>
Сегодня твой день, и пусть он будет таким же особенным,
как и ты! Желаю тебе невероятного счастья, здоровья,
успехов во всех начинаниях и чтобы рядом всегда были
только самые близкие и любящие люди.<br><br>
Ты невероятная! ❤️<br><br>`,

  `Алиса, с праздником!<br><br>
Пусть этот год принесёт тебе много новых открытий,
ярких моментов и незабываемых впечатлений. Желаю, чтобы
все твои мечты сбывались, а жизнь была полна гармонии
и позитивных эмоций.<br><br>
Всего самого наилучшего! 🎉<br><br>`
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


  if (today < birthdayThisYear) {
    // Если сегодня раньше Дня Рождения в текущем году
    const remainingDays = Math.ceil((birthdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    messageParagraph.innerHTML = `
      <p style="font-size: 1.2em; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
        Ой, ты сюда попал слишком рано!<br>
        Возвращайся в День Рождения Алисы!<br><br>
        Осталось ${remainingDays} дней... 🤫
      </p>
    `;
    stopBgMusic(); // Останавливаем фоновую музыку, если она играет
    stopFallingItems(); // Останавливаем эффекты, если случайно запустились
  } else {
    // Если сегодня День Рождения в текущем году или уже после
    const randomIndex = Math.floor(Math.random() * greetings.length);
    const selectedGreeting = greetings[randomIndex];
    typeWriter(messageParagraph, selectedGreeting, 50);
    playBgMusic();
    launchConfetti(); // Запускаем конфетти
    startFallingItems(); // Запускаем падающие сердечки/сакуру
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

  if (value === "чудо" || value === "ты моё чудо") {
    div.innerHTML = "🎉 Ты ввела секретное слово: ты моё чудо! 💖";
  } else {
    div.innerHTML = "😅 Неверное слово. Попробуй снова!";
  }
});

// --- Кнопка «Назад» ---
document.getElementById("backBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.remove("hidden");
  document.getElementById("mainMessage").classList.remove("show");
  document.getElementById("secret-message").style.display = "none";
  document.getElementById("backBtn").classList.add("hidden");
  
  stopBgMusic();
  stopFallingItems(); // Останавливаем падающие элементы при возврате
});

// --- Печать текста по буквам ---
function typeWriter(element, text, speed) {
  let i = 0;
  element.innerHTML = "";
  const fullText = text.replace(/<br>/g, '\n');

  function type() {
    if (i < fullText.length) {
      element.innerHTML += (fullText.charAt(i) === '\n' ? '<br>' : fullText.charAt(i));
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}
