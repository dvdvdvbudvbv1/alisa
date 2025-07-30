// --- Аудио элементы ---
const bgMusic = document.getElementById("bg-music");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const musicTitle = document.querySelector(".music-title");
const musicCover = document.querySelector(".music-cover");

const tracks = [
  { title: "OMFG", src: "./tracks/OMFG.mp3", cover: "./default_cover.png" },
  { title: "Star Shopping", src: "./tracks/Star Shopping.mp3", cover: "./default_cover.png" },
  { title: "The Song They Played When I Crashed", src: "./tracks/The Song They Played When I Crashed.mp3", cover: "./default_cover.png" },
  { title: "Walk Away as the Door Slams (feat. Lil Tracy)", src: "./tracks/Walk Away as the Door Slams (feat. Lil Tracy).mp3", cover: "./default_cover.png" },
  { title: "i feel like", src: "./tracks/i feel like.mp3", cover: "./default_cover.png" },
  { title: "nothing to u", src: "./tracks/nothing to u.flac", cover: "./default_cover.png" },
  { title: "princess (unmastered)", src: "./tracks/princess (unmastered).mp3", cover: "./default_cover.png" },
  { title: "the way i see things", src: "./tracks/the way i see things.flac", cover: "./default_cover.png" },
  { title: "weird", src: "./tracks/weird.mp3", cover: "./default_cover.png" }
];

let currentTrack = 0;
let isPlaying = false;
let loadAttempts = 0;

// --- Загрузка трека ---
function loadTrack(index) {
  const track = tracks[index];
  audioPlayer.src = track.src;
  musicTitle.textContent = track.title;
  musicCover.src = track.cover;

  fetch(track.src)
    .then(res => {
      if (!res.ok) throw new Error("Track not found");
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
        onError: () => {}
      });
      loadAttempts = 0;
      if (isPlaying) playCurrentTrack();
    })
    .catch(err => {
      console.error("Ошибка загрузки:", err);
      loadAttempts++;
      if (loadAttempts < 3) {
        setTimeout(() => loadTrack(index), 1000);
      } else {
        musicTitle.textContent = "Ошибка загрузки трека";
        pauseCurrentTrack();
      }
    });
}

// --- Управление воспроизведением ---
function playCurrentTrack() {
  audioPlayer.play()
    .then(() => {
      isPlaying = true;
      playPauseBtn.textContent = "⏸";
      stopBgMusic();
    })
    .catch(e => {
      console.error("Ошибка воспроизведения:", e);
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
}

function playPrevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
}

// --- Фоновая музыка ---
function playBgMusic() {
  bgMusic.play().catch(e => console.error("BG Music error", e));
}

function stopBgMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

// --- Вибрация ---
function vibrate(duration = 100) {
  if ('vibrate' in navigator) navigator.vibrate(duration);
}

// --- DOM ---
document.addEventListener("DOMContentLoaded", () => {
  loadTrack(currentTrack);

  // Разрешение на воспроизведение
  document.body.addEventListener("click", () => {
    if (audioPlayer.src) {
      audioPlayer.play().then(() => audioPlayer.pause()).catch(() => {});
    }
    bgMusic.play().then(() => bgMusic.pause()).catch(() => {});
  }, { once: true });
});

// --- Кнопки управления ---
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

// --- Кнопка «Музыка» ---
document.getElementById("musicBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.add("hidden");
  document.getElementById("musicPlayer").classList.remove("hidden");
  document.getElementById("backBtn").classList.remove("hidden");

  if (!isPlaying) {
    isPlaying = true;
    playCurrentTrack();
  }

  playPauseBtn.textContent = "⏸";
});

// --- Кнопка «Открыть поздравление» ---
document.getElementById("openBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.add("hidden");
  document.getElementById("mainMessage").classList.add("show");
  document.getElementById("backBtn").classList.remove("hidden");

  const messageParagraph = document.querySelector("#mainMessage p");
  const fullText = `Дорогая Алиса!<br><br>С Днём Рождения тебя, солнце ☀️<br>Пусть в жизни будет больше света, тепла, любви и волшебства.<br>Ты делаешь этот мир ярче, просто оставаясь собой.<br>Я бесконечно рад, что ты есть.<br><br>Никогда не переставай мечтать — ты достойна самого лучшего💗<br><br>С любовью и самыми тёплыми пожеланиями 💫<br><br>`;
  typeWriter(messageParagraph, fullText, 50);
  playBgMusic();
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

// --- Печать по буквам ---
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