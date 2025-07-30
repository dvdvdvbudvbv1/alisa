// Аудио элементы
const bgMusic = document.getElementById("bg-music");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const musicTitle = document.querySelector(".music-title");
const musicCover = document.querySelector(".music-cover");

// Треки
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
  // ... остальные треки ...
].map(track => ({
  ...track,
  src: encodeURI(track.src) // Экранирование пробелов
}));

let currentTrack = 0;
let isPlaying = false;
let audioInitialized = false;

// Инициализация аудио
function initAudio() {
  if (audioInitialized) return;
  
  audioPlayer.preload = "auto";
  bgMusic.preload = "none";
  bgMusic.loop = true;
  
  audioPlayer.addEventListener('error', handleAudioError);
  bgMusic.addEventListener('error', handleAudioError);
  
  audioInitialized = true;
  loadTrack(currentTrack);
}

function handleAudioError(e) {
  console.error("Audio error:", e.target.error);
  if (e.target === audioPlayer) {
    musicTitle.textContent = "Ошибка загрузки трека";
    setTimeout(playNextTrack, 2000);
  }
}

async function loadTrack(index) {
  const track = tracks[index];
  console.log("Loading:", track.src);
  
  try {
    // Проверка доступности
    const response = await fetch(track.src);
    if (!response.ok) throw new Error("Track not available");
    
    audioPlayer.src = track.src;
    musicTitle.textContent = track.title;
    musicCover.src = track.cover;
    
    // Загрузка метаданных
    try {
      const tags = await new Promise((resolve, reject) => {
        jsmediatags.read(track.src, {
          onSuccess: resolve,
          onError: reject
        });
      });
      
      if (tags.tags) {
        const { title, artist, picture } = tags.tags;
        if (title) musicTitle.textContent = title;
        if (artist) musicTitle.textContent += ` - ${artist}`;
        if (picture) {
          const base64 = btoa(String.fromCharCode(...picture.data));
          musicCover.src = `data:${picture.format};base64,${base64}`;
        }
      }
    } catch (metaError) {
      console.log("Metadata error:", metaError);
    }
    
    if (isPlaying) {
      await audioPlayer.play().catch(console.error);
    }
  } catch (error) {
    console.error("Load failed:", error);
    playNextTrack();
  }
}

// Управление воспроизведением
async function togglePlayback() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶️";
  } else {
    try {
      await audioPlayer.play();
      isPlaying = true;
      playPauseBtn.textContent = "⏸";
      bgMusic.pause();
    } catch (error) {
      console.error("Playback failed:", error);
      showAudioActivationPrompt();
    }
  }
}

function showAudioActivationPrompt() {
  const prompt = document.createElement('div');
  prompt.className = 'audio-prompt';
  prompt.innerHTML = `
    <p>Нажмите здесь, чтобы активировать аудио</p>
    <button id="activate-audio">Активировать</button>
  `;
  document.body.appendChild(prompt);
  
  document.getElementById('activate-audio').addEventListener('click', async () => {
    await audioPlayer.play();
    prompt.remove();
  });
}

function playNextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) audioPlayer.play().catch(console.error);
}

function playPrevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) audioPlayer.play().catch(console.error);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  
  // Разблокировка аудио
  const unlock = () => {
    bgMusic.volume = 0;
    bgMusic.play()
      .then(() => bgMusic.pause())
      .catch(console.log)
      .finally(() => bgMusic.volume = 1);
  };
  
  document.addEventListener('click', unlock, { once: true });
});

// Обработчики
playPauseBtn.addEventListener("click", togglePlayback);
prevBtn.addEventListener("click", playPrevTrack);
nextBtn.addEventListener("click", playNextTrack);
audioPlayer.addEventListener('ended', playNextTrack);
// Остальные обработчики (поздравление, секретное слово и т.д.) остаются без изменений
// ... (код из предыдущего ответа)
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