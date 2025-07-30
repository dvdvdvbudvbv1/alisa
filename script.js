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
  // При переходе в раздел музыки, загружаем текущий трек (который уже установлен)
  // и убеждаемся, что кнопка "play/pause" показывает правильное состояние
  if (!audio.paused) {
    playPauseBtn.textContent = "⏸";
  } else {
    playPauseBtn.textContent = "▶️";
  }
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
  audio.pause(); // Останавливаем воспроизведение трека из плеера
  playPauseBtn.textContent = "▶️"; // Сбрасываем иконку на "играть"
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

// ВАЖНО: Убедитесь, что имена файлов в папке 'tracks' ТОЧНО соответствуют src здесь, включая расширения!
// ДОБАВЛЕНО: cover: "default_cover.png" для каждого трека
let tracks = [
  { title: "The Way I See Things", src: "tracks/01 the way u see things.mp3", cover: "default_cover.png" },
  { title: "OMG", src: "tracks/02 OMG.mp3", cover: "default_cover.png" },
  { title: "The Song They Played (When I Crashed)", src: "tracks/03 The Song They Played (When I Crashed).mp3", cover: "default_cover.png" },
  { title: "Nothing To Do", src: "tracks/04 Nothing To Do.mp3", cover: "default_cover.png" },
  { title: "OM.Nomnom", src: "tracks/05 OM.Nomnom.mp3", cover: "default_cover.png" },
  { title: "When I Lie (but the door slaps kinda)", src: "tracks/06 When I Lie (but the door slaps kinda).mp3", cover: "default_cover.png" },
  { title: "Star Shopping", src: "tracks/07 Star Shopping.mp3", cover: "default_cover.png" },
  { title: "Walk Away In The Door (demo F_ck)", src: "tracks/08 Walk Away In The Door (demo F_ck).mp3", cover: "default_cover.png" },
  { title: "Absolute in Doubt", src: "tracks/09 Absolute in Doubt.mp3", cover: "default_cover.png" },
  { title: "Hell Like", src: "tracks/10 Hell Like.mp3", cover: "default_cover.png" },
  { title: "promised (unreleased)", src: "tracks/11 promised (unreleased).flac", cover: "default_cover.png" },
  { title: "Still Alive (feat lido) (for a day)", src: "tracks/12 Still Alive (feat lido) (for a day).wav", cover: "default_cover.png" },
  { title: "wxtd", src: "tracks/wxtd.mp3", cover: "default_cover.png" }
];
let currentTrack = 0;

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;

  // Используем jsmediatags для чтения ID3-тегов
  jsmediatags.read(track.src, {
    onSuccess: function(tag) {
      const tags = tag.tags;
      let displayTitle = tags.title || track.title; // Используем заголовок из ID3, если есть

      if (tags.artist) {
        displayTitle += " - " + tags.artist; // Добавляем исполнителя
      }
      musicTitle.textContent = "Трек: " + displayTitle;

      // Обработка обложки альбома
      if (tags.picture) {
        const image = tags.picture;
        let base64String = "";
        for (let i = 0; i < image.data.length; i++) {
          base64String += String.fromCharCode(image.data[i]);
        }
        const base64Url = "data:" + image.format + ";base64," + window.btoa(base64String);
        document.querySelector(".music-cover").src = base64Url;
      } else {
        document.querySelector(".music-cover").src = "default_cover.png"; // Заглушка, если обложки нет
      }
    },
    onError: function(error) {
      console.error("Ошибка при чтении тегов для " + track.src + ":", error);
      musicTitle.textContent = "Трек: " + track.title; // Используем название из массива при ошибке
      document.querySelector(".music-cover").src = "default_cover.png"; // Используем заглушку при ошибке
    }
  });
}

// Загружаем первый трек при инициализации
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

// Добавляем обработчик события 'ended' для автоматического перехода к следующему треку
audio.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
  playPauseBtn.textContent = "⏸";
});