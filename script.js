// Аудио элементы
const bgMusic = document.getElementById("bg-music");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const musicTitle = document.querySelector(".music-title");
const musicCover = document.querySelector(".music-cover");

// Треки
const tracks = [
  { title: "The Way I See Things", src: "./tracks/01 the way u see things.mp3", cover: "./default_cover.png" },
  { title: "OMG", src: "./tracks/02 OMG.mp3", cover: "./default_cover.png" },
  { title: "The Song They Played (When I Crashed)", src: "./tracks/03 The Song They Played (When I Crashed).mp3", cover: "./default_cover.png" },
  { title: "Nothing To Do", src: "./tracks/04 Nothing To Do.mp3", cover: "./default_cover.png" },
  { title: "OM.Nomnom", src: "./tracks/05 OM.Nomnom.mp3", cover: "./default_cover.png" },
  { title: "When I Lie (but the door slaps kinda)", src: "./tracks/06 When I Lie (but the door slaps kinda).mp3", cover: "./default_cover.png" },
  { title: "Star Shopping", src: "./tracks/07 Star Shopping.mp3", cover: "./default_cover.png" },
  { title: "Walk Away In The Door (demo F_ck)", src: "./tracks/08 Walk Away In The Door (demo F_ck).mp3", cover: "./default_cover.png" },
  { title: "Absolute in Doubt", src: "./tracks/09 Absolute in Doubt.mp3", cover: "./default_cover.png" },
  { title: "Hell Like", src: "./tracks/10 Hell Like.mp3", cover: "./default_cover.png" },
  { title: "promised (unreleased)", src: "./tracks/11 promised (unreleased).flac", cover: "./default_cover.png" },
  { title: "Still Alive (feat lido) (for a day)", src: "./tracks/12 Still Alive (feat lido) (for a day).wav", cover: "./default_cover.png" },
  { title: "wxtd", src: "./tracks/wxtd.mp3", cover: "./default_cover.png" }
];

let currentTrack = 0;
let isPlaying = false;

// Инициализация аудио
function initAudio() {
  // Настройка аудио элементов
  audioPlayer.preload = "auto";
  bgMusic.preload = "auto";
  
  // Обработчики ошибок
  audioPlayer.addEventListener('error', (e) => {
    console.error("Audio Player Error:", e);
    musicTitle.textContent = "Ошибка загрузки трека";
    setTimeout(playNextTrack, 2000);
  });

  bgMusic.addEventListener('error', (e) => {
    console.error("Background Music Error:", e);
  });

  // Загрузка первого трека
  loadTrack(currentTrack);
}

// Загрузка трека
function loadTrack(index) {
  const track = tracks[index];
  console.log("Loading track:", track.src);

  // Проверка доступности трека
  fetch(track.src)
    .then(response => {
      if (!response.ok) throw new Error("Track not found");
      
      audioPlayer.src = track.src;
      musicTitle.textContent = track.title;
      musicCover.src = track.cover;

      // Попытка чтения метаданных
      jsmediatags.read(track.src, {
        onSuccess: function(tag) {
          const tags = tag.tags;
          if (tags.title) musicTitle.textContent = tags.title;
          if (tags.artist) musicTitle.textContent += ` - ${tags.artist}`;
          
          if (tags.picture) {
            const base64String = btoa(String.fromCharCode(...tags.picture.data));
            musicCover.src = `data:${tags.picture.format};base64,${base64String}`;
          }
        },
        onError: () => console.log("No metadata found")
      });

      if (isPlaying) {
        audioPlayer.play().catch(e => console.error("Play error:", e));
      }
    })
    .catch(error => {
      console.error("Track load error:", error);
      playNextTrack();
    });
}

// Управление воспроизведением
function playCurrentTrack() {
  audioPlayer.play()
    .then(() => {
      isPlaying = true;
      playPauseBtn.textContent = "⏸";
      stopBgMusic(); // Останавливаем фоновую музыку при включении трека
    })
    .catch(e => {
      console.error("Play failed:", e);
      // Показать кнопку активации аудио
      if (e.name === 'NotAllowedError') {
        musicTitle.textContent = "Нажмите '▶️' для активации";
      }
    });
}

function pauseCurrentTrack() {
  audioPlayer.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶️";
}

function playNextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) playCurrentTrack();
}

function playPrevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) playCurrentTrack();
}

// Фоновая музыка (уже есть выше, но дублирую, чтобы функции были доступны)
// function playBgMusic() { /* ... */ }
// function stopBgMusic() { /* ... */ }

// Вибрация
function vibrate(duration = 100) {
  if ('vibrate' in navigator) navigator.vibrate(duration);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  
  // Разблокировка аудио по первому клику
  document.body.addEventListener('click', () => {
    audioPlayer.play().then(() => audioPlayer.pause());
    bgMusic.play().then(() => bgMusic.pause());
  }, { once: true });
});

// Обработчики кнопок плеера
playPauseBtn.addEventListener("click", () => {
  vibrate();
  isPlaying ? pauseCurrentTrack() : playCurrentTrack();
});

prevBtn.addEventListener("click", () => {
  vibrate();
  playPrevTrack();
});

nextBtn.addEventListener("click", () => {
  vibrate();
  playNextTrack();
});

audioPlayer.addEventListener('ended', playNextTrack);


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


// --- Дата Дня Рождения Алисы (Месяц и День) ---
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

  // Определяем дату Дня Рождения в следующем году, если текущий уже прошел
  let nextBirthdayYear = currentYear;
  if (today > birthdayThisYear) {
      nextBirthdayYear = currentYear + 1;
  }
  const nextBirthday = new Date(nextBirthdayYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
  nextBirthday.setHours(0, 0, 0, 0);

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
document.getElementById("musicBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.add("hidden");
  document.getElementById("musicPlayer").classList.remove("hidden");
  document.getElementById("backBtn").classList.remove("hidden");
  
  // Обновляем состояние кнопки play/pause
  playPauseBtn.textContent = isPlaying ? "⏸" : "▶️";
  stopBgMusic(); // Останавим фоновую музыку при открытии плеера
  stopFallingItems(); // Останавливаем эффекты, если случайно запустились
});


// --- Кнопка «Назад» ---
document.getElementById("backBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.remove("hidden");
  document.getElementById("mainMessage").classList.remove("show");
  document.getElementById("secret-message").style.display = "none";
  document.getElementById("musicPlayer").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");
  
  pauseCurrentTrack();
  stopBgMusic();
  stopFallingItems(); // Останавливаем падающие элементы при возврате
});

// --- Печать текста по буквам ---
// Добавлена очистка элемента перед началом печати
let typeWriterTimeout; // Для хранения таймаута, чтобы можно было его отменить
function typeWriter(element, text, speed) {
  if (typeWriterTimeout) { // Если предыдущая печать не закончена, отменяем её
    clearTimeout(typeWriterTimeout);
  }
  element.innerHTML = ""; // Очищаем содержимое элемента перед новой печатью
  let i = 0;
  const fullText = text.replace(/<br>/g, '\n');

  function type() {
    if (i < fullText.length) {
      element.innerHTML += (fullText.charAt(i) === '\n' ? '<br>' : fullText.charAt(i));
      i++;
      typeWriterTimeout = setTimeout(type, speed);
    }
  }
  type();
}
