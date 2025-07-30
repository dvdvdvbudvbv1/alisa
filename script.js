// --- Глобальные переменные ---
const bgMusic = document.getElementById("bg-music");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const musicTitle = document.querySelector(".music-title");
const musicCover = document.querySelector(".music-cover");

// --- Треки для плеера ---
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

// --- Функции плеера ---
function loadTrack(index) {
  const track = tracks[index];
  
  // Проверка доступности трека
  fetch(track.src)
    .then(response => {
      if (!response.ok) throw new Error("Трек не найден");
      
      audioPlayer.src = track.src;
      musicTitle.textContent = `Трек: ${track.title}`;
      musicCover.src = track.cover;
      
      // Попытка чтения метаданных
      jsmediatags.read(track.src, {
        onSuccess: function(tag) {
          const tags = tag.tags;
          let displayTitle = tags.title || track.title;
          
          if (tags.artist) {
            displayTitle += ` - ${tags.artist}`;
          }
          musicTitle.textContent = displayTitle;

          if (tags.picture) {
            const image = tags.picture;
            let base64String = "";
            for (let i = 0; i < image.data.length; i++) {
              base64String += String.fromCharCode(image.data[i]);
            }
            musicCover.src = `data:${image.format};base64,${window.btoa(base64String)}`;
          }
        },
        onError: function(error) {
          console.log("Метаданные не найдены, используется информация по умолчанию");
        }
      });
      
      if (isPlaying) {
        audioPlayer.play().catch(e => console.error("Ошибка воспроизведения:", e));
      }
    })
    .catch(error => {
      console.error("Ошибка загрузки трека:", error);
      // Переход к следующему треку при ошибке
      currentTrack = (currentTrack + 1) % tracks.length;
      loadTrack(currentTrack);
    });
}

function playCurrentTrack() {
  stopBgMusic();
  audioPlayer.play()
    .then(() => {
      isPlaying = true;
      playPauseBtn.textContent = "⏸";
    })
    .catch(e => {
      console.error("Ошибка воспроизведения:", e);
      isPlaying = false;
      playPauseBtn.textContent = "▶️";
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
  playCurrentTrack();
}

function playPrevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  playCurrentTrack();
}

// --- Инициализация плеера ---
loadTrack(currentTrack);

// --- Обработчики событий плеера ---
playPauseBtn.addEventListener("click", () => {
  vibrate();
  if (isPlaying) {
    pauseCurrentTrack();
  } else {
    playCurrentTrack();
  }
});

prevBtn.addEventListener("click", () => {
  vibrate();
  playPrevTrack();
});

nextBtn.addEventListener("click", () => {
  vibrate();
  playNextTrack();
});

audioPlayer.addEventListener('ended', () => {
  playNextTrack();
});

// --- Фоновая музыка ---
function playBgMusic() {
  bgMusic.play().catch(e => console.error("Ошибка фоновой музыки:", e));
}

function stopBgMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
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
  playBgMusic();
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
  
  // Обновляем состояние кнопки play/pause
  playPauseBtn.textContent = isPlaying ? "⏸" : "▶️";
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