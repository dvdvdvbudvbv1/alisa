// --- Аудио ---
const bgMusic = document.getElementById("bg-music");

// --- Конфетти ---
function launchConfetti() {
  if (typeof confetti === 'undefined') return;
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
}

// --- Падение ---
const fallingItems = ['❤️', '🌸'];
let fallingInterval;

function startFallingItems() {
  stopFallingItems(); 
  fallingInterval = setInterval(() => {
    const item = document.createElement('div');
    item.classList.add('falling-item');
    item.textContent = fallingItems[Math.floor(Math.random() * fallingItems.length)];
    item.style.left = `${Math.random() * 100}vw`;
    item.style.fontSize = `${Math.random() * 20 + 15}px`;
    item.style.animationDuration = `${Math.random() * 5 + 5}s`;
    document.body.appendChild(item);
    item.addEventListener('animationend', () => item.remove());
  }, 300);
}

function stopFallingItems() {
  clearInterval(fallingInterval);
  document.querySelectorAll('.falling-item').forEach(item => item.remove());
}

function playBgMusic() {
  if (bgMusic) {
    bgMusic.play().catch(e => console.error(e));
  }
}

function stopBgMusic() {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}

function pauseCurrentTrack() {}

let typeWriterTimeout = null;

function typeWriter(element, text, speed) {
  if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
  element.innerHTML = "";
  let i = 0;
  const chars = text.split('');
  function type() {
    if (i < chars.length) {
      element.innerHTML += (chars[i] === '\n' ? '<br>' : chars[i]);
      i++;
      typeWriterTimeout = setTimeout(type, speed);
    } else {
      typeWriterTimeout = null;
    }
  }
  type();
}

// --- День рождения ---
const BIRTHDAY_MONTH = 4;
const BIRTHDAY_DAY = 19;
let isBirthdayToday = false;

const greetings = [
  `Дорогая Алиса!\n\nС Днём Рождения тебя, солнце ☀️\nПусть в жизни будет больше света...`,
  `Моя чудесная Алиса!\n\nС Днём Рождения! Пусть каждый твой день будет полон...`,
  `С Днём Рождения, Алиса!\n\nТы невероятная! ❤️\n\n`,
  `Алиса, с праздником!\n\nПусть этот год принесёт тебе много...`
];

document.getElementById("openBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.add("hidden");
  document.getElementById("mainMessage").classList.add("show");
  document.getElementById("backBtn").classList.remove("hidden");

  const messageParagraph = document.querySelector("#mainMessage p");

  if (!isBirthdayToday) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthdayThisYear = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    today.setHours(0, 0, 0, 0);
    birthdayThisYear.setHours(0, 0, 0, 0);
    let nextBirthdayYear = currentYear;
    if (today > birthdayThisYear) nextBirthdayYear = currentYear + 1;
    const nextBirthday = new Date(nextBirthdayYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    const remainingDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
    messageParagraph.innerHTML = "";
    const fallbackText = `Ой, ты сюда попала слишком рано!\n\nОсталось ${remainingDays} дней `;
    typeWriter(messageParagraph, fallbackText, 50);

    stopBgMusic();
    stopFallingItems();
    pauseCurrentTrack();
  } else {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    const selectedGreeting = greetings[randomIndex];
    typeWriter(messageParagraph, selectedGreeting, 50);
    playBgMusic();
    launchConfetti();
    startFallingItems();
    pauseCurrentTrack();
  }
});

document.getElementById("check-secret").addEventListener("click", () => {
  vibrate();
  const value = document.getElementById("secret-input").value.trim().toLowerCase();
  const div = document.getElementById("secret-message");
  document.getElementById("main-buttons").classList.add("hidden");
  div.style.display = 'block';
  document.getElementById("backBtn").classList.remove("hidden");

  if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
  div.innerHTML = "";

  if (value === "чудо" || value === "ты моё чудо") {
    div.innerHTML = "🎉 Ты ввела секретное слово: ты моё чудо! 💖";
  } else {
    div.innerHTML = "😅 Неверное слово. Попробуй снова!";
  }

  stopBgMusic();
  stopFallingItems();
  pauseCurrentTrack();
});

document.getElementById("backBtn").addEventListener("click", () => {
  vibrate();
  document.getElementById("main-buttons").classList.remove("hidden");
  document.getElementById("mainMessage").classList.remove("show");
  document.getElementById("secret-message").style.display = "none";
  document.getElementById("backBtn").classList.add("hidden");

  pauseCurrentTrack();
  stopBgMusic();
  stopFallingItems();

  if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
  document.querySelector("#mainMessage p").innerHTML = "";
});

function vibrate(duration = 100) {
  if ('vibrate' in navigator) navigator.vibrate(duration);
}

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthdayThisYear = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
  today.setHours(0, 0, 0, 0);
  birthdayThisYear.setHours(0, 0, 0, 0);
  let nextBirthdayYear = currentYear;
  if (today > birthdayThisYear) nextBirthdayYear++;
  const nextBirthday = new Date(nextBirthdayYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);

  isBirthdayToday = today.getTime() === birthdayThisYear.getTime();

  document.title = isBirthdayToday ? "С Днём Рождения, Алиса!" : "Скоро День Рождения Алисы!";

  document.body.addEventListener('click', () => {
    if (bgMusic) bgMusic.play().then(() => bgMusic.pause()).catch(() => {});
  }, { once: true });
});

// --- Сердечная сцена ---
document.getElementById("open-heart").addEventListener("click", () => {
  document.getElementById("main-content-wrapper").classList.add("hidden");
  document.getElementById("heart-scene").classList.remove("hidden");
  startHeartAnimation();
});

document.getElementById("backFromHeart").addEventListener("click", () => {
  document.getElementById("heart-scene").classList.add("hidden");
  document.getElementById("main-content-wrapper").classList.remove("hidden");
});

function startHeartAnimation() {
  const canvas = document.getElementById("heartCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const numParticles = 600;

  for (let i = 0; i < numParticles; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = 16 * Math.pow(Math.sin(t), 3);
    const x = canvas.width / 2 + 10 * r * Math.cos(t);
    const y = canvas.height / 2 - 10 * r * Math.sin(t);

    particles.push({
      x,
      y,
      size: Math.random() * 2 + 1,
      alpha: 0.5 + Math.random() * 0.5,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 105, 180, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  animate();
}