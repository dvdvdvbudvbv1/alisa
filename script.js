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
  { title: "The Way I See Things", src: encodeURI("./tracks/01 the way u see things.mp3"), cover: "./default_cover.png" },
  { title: "OMG", src: encodeURI("./tracks/02 OMG.mp3"), cover: "./default_cover.png" },
  { title: "The Song They Played (When I Crashed)", src: encodeURI("./tracks/03 The Song They Played (When I Crashed).mp3"), cover: "./default_cover.png" },
  { title: "Nothing To Do", src: encodeURI("./tracks/04 Nothing To Do.mp3"), cover: "./default_cover.png" },
  { title: "OM.Nomnom", src: encodeURI("./tracks/05 OM.Nomnom.mp3"), cover: "./default_cover.png" },
  { title: "When I Lie (but the door slaps kinda)", src: encodeURI("./tracks/06 When I Lie (but the door slaps kinda).mp3"), cover: "./default_cover.png" },
  { title: "Star Shopping", src: encodeURI("./tracks/07 Star Shopping.mp3"), cover: "./default_cover.png" },
  { title: "Walk Away In The Door (demo F_ck)", src: encodeURI("./tracks/08 Walk Away In The Door (demo F_ck).mp3"), cover: "./default_cover.png" },
  { title: "Absolute in Doubt", src: encodeURI("./tracks/09 Absolute in Doubt.mp3"), cover: "./default_cover.png" },
  { title: "Hell Like", src: encodeURI("./tracks/10 Hell Like.mp3"), cover: "./default_cover.png" },
  { title: "promised (unreleased)", src: encodeURI("./tracks/11 promised (unreleased).flac"), cover: "./default_cover.png" },
  { title: "Still Alive (feat lido) (for a day)", src: encodeURI("./tracks/12 Still Alive (feat lido) (for a day).wav"), cover: "./default_cover.png" },
  { title: "wxtd", src: encodeURI("./tracks/wxtd.mp3"), cover: "./default_cover.png" }
];

let currentTrack = 0;
let isPlaying = false;

// Инициализация
function initAudio() {
  audioPlayer.preload = "none";
  bgMusic.preload = "none";

  audioPlayer.addEventListener("error", (e) => {
    console.error("Audio Player Error:", e);
    musicTitle.textContent = "Ошибка загрузки трека";
    setTimeout(playNextTrack, 2000);
  });

  bgMusic.addEventListener("error", (e) => {
    console.error("Background Music Error:", e);
  });

  loadTrack(currentTrack);
}

// Загрузка трека
function loadTrack(index) {
  const track = tracks[index];
  audioPlayer.src = track.src;
  musicTitle.textContent = track.title;
  musicCover.src = track.cover;

  fetch(track.src)
    .then(res => {
      if (!res.ok) throw new Error("Файл не найден");
      return res.blob();
    })
    .then(blob => {
      jsmediatags.read(blob, {
        onSuccess: function(tag) {
          const tags = tag.tags;
          if (tags.title) musicTitle.textContent = tags.title;
          if (tags.artist) musicTitle.textContent += ` - ${tags.artist}`;
          if (tags.picture) {
            const base64String = btoa(String.fromCharCode(...tags.picture.data));
            musicCover.src = `data:${tags.picture.format};base64,${base64String}`;
          }
        },
        onError: () => console.log("Нет метаданных")
      });

      if (isPlaying) {
        audioPlayer.play().catch(handlePlayError);
      }
    })
    .catch(err => {
      console.error("Ошибка загрузки:", err);
      playNextTrack();
    });
}

// Воспроизведение и пауза
function playCurrentTrack() {
  audioPlayer.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
    stopBgMusic();
  }).catch(handlePlayError);
}

function pauseCurrentTrack() {
  audioPlayer.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶️";
}

function handlePlayError(e) {
  console.error("Play failed:", e);
  if (e.name === 'NotAllowedError') showAudioPrompt();
}

// Следующий / предыдущий трек
function playNextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
}

function playPrevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
}

// Фоновая музыка
function playBgMusic() {
  bgMusic.play().then(() => console.log("Фоновая музыка включена")).catch(console.error);
}

function stopBgMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

// Вибрация
function vibrate(duration = 100) {
  if ('vibrate' in navigator) navigator.vibrate(duration);
}

// Печать текста по буквам
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

// Активация звука вручную
function showAudioPrompt() {
  const prompt = document.getElementById("audioPrompt");
  if (prompt) prompt.classList.remove("hidden");
}

function startAudio() {
  audioPlayer.play().catch(console.error);
  bgMusic.play().catch(console.error);
  const prompt = document.getElementById("audioPrompt");
  if (prompt) prompt.classList.add("hidden");
}

// DOM Загрузка
document.addEventListener("DOMContentLoaded", () => {
  initAudio();
  document.body.addEventListener("click", () => {
    audioPlayer.play().then(() => audioPlayer.pause());
    bgMusic.play().then(() => bgMusic.pause());
  }, { once: true });
});

// Обработчики кнопок
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

audioPlayer.addEventListener("ended", playNextTrack);

// Открыть поздравление
document.getElementById("openBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.add("hidden");
  document.getElementById("mainMessage").classList.add("show");
  document.getElementById("backBtn").classList.remove("hidden");

  const messageParagraph = document.querySelector("#mainMessage p");
  const fullText = `Дорогая Алиса!<br><br>
С Днём Рождения тебя, солнце ☀️<br>
Пусть в жизни будет больше света, тепла, любви и волшебства.<br>
Ты делаешь этот мир ярче, просто оставаясь собой.<br>
Я бесконечно рад, что ты есть.<br><br>
Никогда не переставай мечтать — ты достойна самого лучшего💗<br><br>
С любовью и самыми тёплыми пожеланиями 💫<br><br>`;
  typeWriter(messageParagraph, fullText, 50);
  playBgMusic();
});

// Секретное слово
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

// Музыка
document.getElementById("musicBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.add("hidden");
  document.getElementById("musicPlayer").classList.remove("hidden");
  document.getElementById("backBtn").classList.remove("hidden");

  playPauseBtn.textContent = isPlaying ? "⏸" : "▶️";

  // Автовоспроизведение трека
  if (!isPlaying) {
    playCurrentTrack();
  }
});

// Назад
document.getElementById("backBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.remove("hidden");
  document.getElementById("mainMessage").classList.remove("show");
  document.getElementById("secret-message").style.display = "none";
  document.getElementById("musicPlayer").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");
  pauseCurrentTrack();
  stopBgMusic();
});