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

// ВАЖНО: Убедитесь, что имена файлов MP3 в папке 'tracks' ТОЧНО соответствуют src здесь!
let tracks = [
  { title: "Star Shopping", src: "tracks/LIL PEEP - star shopping.mp3", cover: "default_cover.jpg" },
  { title: "Awful Things", src: "tracks/LIL PEEP - awful things (prod. smokeasac).mp3", cover: "default_cover.jpg" },
  { title: "Save That Shit", src: "tracks/LIL PEEP - save that shit (prod. smokeasac).mp3", cover: "default_cover.jpg" },
  { title: "Beamer Boy", src: "tracks/LIL PEEP - beamer boy (prod. nedarb).mp3", cover: "default_cover.jpg" },
  { title: "Crybaby", src: "tracks/LIL PEEP - crybaby (prod. lederrick & lil peep).mp3", cover: "default_cover.jpg" },
  { title: "White Tee", src: "tracks/LIL PEEP - white tee (prod. boy froot).mp3", cover: "default_cover.jpg" },
  { title: "Life is Beautiful", src: "tracks/LIL PEEP - life is beautiful.mp3", cover: "default_cover.jpg" },
  { title: "Benz Truck", src: "tracks/LIL PEEP - benz truck (гелик) (prod. brothel).mp3", cover: "default_cover.jpg" },
  { title: "Better Off (Dying)", src: "tracks/LIL PEEP - better off (dying).mp3", cover: "default_cover.jpg" },
  { title: "Come Over", src: "tracks/LIL PEEP - come over (prod. boy froot).mp3", cover: "default_cover.jpg" },
  { title: "Ghost Boy", src: "tracks/LIL PEEP - ghost boy (prod. kirb la goop).mp3", cover: "default_cover.jpg" },
  { title: "Giving Girls", src: "tracks/LIL PEEP - giving girls cocaine (prod. mysticphonk).mp3", cover: "default_cover.jpg" },
  { title: "Gucci Mane", src: "tracks/LIL PEEP - gucci mane (prod. c-gutta & kryptik).mp-3", cover: "default_cover.jpg" },
  { title: "Hellboy", src: "tracks/LIL PEEP - hellboy (prod. yung Cortex).mp3", cover: "default_cover.jpg" },
  { title: "I've Been Waiting", src: "tracks/LIL PEEP - i've been waiting (with ilovemakonnen) (feat. fall out boy).mp3", cover: "default_cover.jpg" },
  { title: "Live Forever", src: "tracks/LIL PEEP - live forever (prod. brothel).mp3", cover: "default_cover.jpg" },
  { title: "Nothing To Do", src: "tracks/LIL PEEP - nothing to do (prod. kryptik).mp3", cover: "default_cover.jpg" },
  { title: "Right Here", src: "tracks/LIL PEEP - right here (prod. nedarb).mp3", cover: "default_cover.jpg" },
  { title: "The Brightside", src: "tracks/LIL PEEP - the brightside (prod. smokeasac).mp3", cover: "default_cover.jpg" },
  { title: "The Way I See Things", src: "tracks/LIL PEEP - the way i see things (prod. kryptik).mp3", cover: "default_cover.jpg" },
  { title: "Witchblades", src: "tracks/LIL PEEP - witchblades (with lil tracy) (prod. bighead).mp3", cover: "default_cover.jpg" },
  { title: "When I Lie", src: "tracks/LIL PEEP - when i lie (prod. smokeasac).mp3", cover: "default_cover.jpg" },
  { title: "Broken Smile", src: "tracks/LIL PEEP - broken smile (my all).mp3", cover: "default_cover.jpg" },
  { title: "Teen Romance", src: "tracks/LIL PEEP - teen romance.mp3", cover: "default_cover.jpg" },
  { title: "Sex with My Ex", src: "tracks/LIL PEEP - sex with my ex.mp3", cover: "default_cover.jpg" },
  { title: "Falling Down", src: "tracks/LIL PEEP & XXXTENTACION - falling down.mp3", cover: "default_cover.jpg" },
  { title: "Spotlight", src: "tracks/LIL PEEP & MARSHMELLO - spotlight.mp3", cover: "default_cover.jpg" },
  { title: "Dreams", src: "tracks/LIL PEEP & CRAZYBOY - dreams.mp3", cover: "default_cover.jpg" },
  { title: "4 Gold Chains", src: "tracks/LIL PEEP & CLAMS CASINO - 4 gold chains (feat. firstborn).mp3", cover: "default_cover.jpg" }
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
        document.querySelector(".music-cover").src = "default_cover.jpg"; // Заглушка, если обложки нет
      }
    },
    onError: function(error) {
      console.error("Ошибка при чтении ID3-тегов:", error);
      musicTitle.textContent = "Трек: " + track.title; // Используем название из массива при ошибке
      document.querySelector(".music-cover").src = "default_cover.jpg"; // Используем заглушку при ошибке
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