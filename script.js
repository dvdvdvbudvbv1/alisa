// --- Музыка для фона ---
function playMusic() {
  const music = document.getElementById("bg-music");
  music.play().catch(e => console.error("Ошибка при воспроизведении фона:", e));
}

function stopMusic() {
  const music = document.getElementById("bg-music");
  music.pause();
  music.currentTime = 0;
}

// --- Вибрация ---
function vibrate(duration = 100) {
  if ('vibrate' in navigator) navigator.vibrate(duration);
}

// --- Кнопка «Открыть поздравление» ---
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
  playMusic();
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

// --- Кнопка «Музыка» ---
document.getElementById("musicBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.add("hidden");
  document.getElementById("musicPlayer").classList.remove("hidden");
  document.getElementById("backBtn").classList.remove("hidden");
});

// --- Кнопка «← Назад» ---
document.getElementById("backBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.remove("hidden");
  document.getElementById("mainMessage").classList.remove("show");
  document.getElementById("secret-message").style.display = "none";
  document.getElementById("musicPlayer").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");
  stopMusic();
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

// --- Плеер: кнопки управления ---
const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const musicTitle = document.querySelector(".music-title");

let tracks = [
  { title: "Star Shopping", src: "tracks/star_shopping.mp3" },
  { title: "Awful Things", src: "tracks/awful_things.mp3" },
  { title: "Save That Shit", src: "tracks/save_that_shit.mp3" },
  { title: "Beamer Boy", src: "tracks/beamer_boy.mp3" },
  { title: "Crybaby", src: "tracks/crybaby.mp3" },
  { title: "White Tee", src: "tracks/white_tee.mp3" },
  { title: "Life is Beautiful", src: "tracks/life_is_beautiful.mp3" },
  { title: "Benz Truck", src: "tracks/benz_truck.mp3" },
  { title: "Better Off (Dying)", src: "tracks/better_off.mp3" }
];
let currentTrack = 0;

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  document.querySelector(".music-cover").src = track.cover;
  musicTitle.textContent = "Трек: " + track.title;
}

loadTrack(currentTrack);

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  }
});

document.getElementById("prevBtn").addEventListener("click", () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
  playPauseBtn.textContent = "⏸";
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
  playPauseBtn.textContent = "⏸";
});
