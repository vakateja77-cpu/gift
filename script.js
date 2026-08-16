/* =========================================================
   FOR SURBHI — script.js
   Everything below the "CONFIG" block is safe to leave alone.
   Edit the CONFIG block to personalize the site.
   ========================================================= */

/* ================= CONFIG — EDIT ME ================= */

const girlfriendName = "Surbhi";

// Add / replace photos here. `src` must point to a file inside /assets.
// Drop your own images into the assets folder (see README notes at bottom
// of this file) and just change the filenames below — nothing else
// needs to change.
const photos = [
  { src: "assets/photo1.jpg.jpeg", caption: "That smile ❤️" },
  { src: "assets/photo2.jpg.jpeg", caption: "One of my favorite moments" },
  { src: "assets/photo3.jpg.jpeg", caption: "Forever memory" },
  { src: "assets/photo4.jpg.jpeg", caption: "Us 🫶" },
  { src: "assets/photo5.jpg.jpeg", caption: "Just you being you" },
  { src: "assets/photo6.jpg.jpeg", caption: "More memories to come..." },
];

const musicFile = "assets/hangova.mpeg";

// The birthday letter on Page 2. Each array item becomes its own
// animated line — split wherever you'd like a natural pause.
const letterLines = [
  `Happy Birthday my dear ${girlfriendName} ❤️🥹!`,
  "You're the most beautiful thing in my life. Ignore all other people and be mine for ever.",
  "Nee smile alane undali eppudu nenu unna lekapoina.",
  "Eppudu ilaane happy ga undu.",
  "Nee dreams anni fulfill avvali.",
  "I'm really lucky to have you bangaram.",
  "Love you sooo much ❤️🎂🫶",
];

/* ================= END CONFIG ================= */


document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initFloatingHeartsCanvas();
  initProgressTrail();
  initNavigation();
  initQuestionPage();
  initLetterPage();
  initWhyCards();
  initGallery();
  initEnvelope();
  initCake();
  initMusic();
  initFinale();
});

/* ============================================================
   LOADING SCREEN
   ============================================================ */
function initLoadingScreen() {
  const screen = document.getElementById("loading-screen");
  // Give the two loading lines a moment to be read, then reveal the site.
  window.setTimeout(() => {
    screen.classList.add("hidden");
  }, 2400);
}

/* ============================================================
   AMBIENT FLOATING HEARTS (canvas, lightweight)
   ============================================================ */
function initFloatingHeartsCanvas() {
  const canvas = document.getElementById("hearts-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let particles = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }
  resize();
  window.addEventListener("resize", resize);

  const COUNT = window.innerWidth < 600 ? 12 : 20;

  function makeParticle() {
    return {
      x: Math.random() * w,
      y: h + Math.random() * h,
      size: (8 + Math.random() * 14) * dpr,
      speed: (0.25 + Math.random() * 0.5) * dpr,
      drift: (Math.random() - 0.5) * 0.4 * dpr,
      sway: Math.random() * Math.PI * 2,
      opacity: 0.08 + Math.random() * 0.18,
    };
  }
  particles = Array.from({ length: COUNT }, makeParticle);

  function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    const s = size / 16;
    ctx.moveTo(0, 4 * s);
    ctx.bezierCurveTo(-8 * s, -6 * s, -16 * s, 2 * s, 0, 12 * s);
    ctx.bezierCurveTo(16 * s, 2 * s, 8 * s, -6 * s, 0, 4 * s);
    ctx.closePath();
    ctx.fillStyle = `rgba(231, 168, 192, ${opacity})`;
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.sway += 0.01;
      p.x += Math.sin(p.sway) * p.drift;
      if (p.y < -20) Object.assign(p, makeParticle(), { y: h + 20 });
      drawHeart(p.x, p.y, p.size, p.opacity);
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ============================================================
   PROGRESS TRAIL (1 / 7 style, shown as dots)
   ============================================================ */
const TOTAL_PAGES = 7;
function initProgressTrail() {
  const trail = document.getElementById("progress-trail");
  trail.innerHTML = "";
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    dot.dataset.page = i;
    trail.appendChild(dot);
  }
  updateProgressTrail(1);
}
function updateProgressTrail(current) {
  document.querySelectorAll(".progress-dot").forEach((dot) => {
    const page = Number(dot.dataset.page);
    dot.classList.toggle("current", page === current);
    dot.classList.toggle("done", page < current);
  });
}

/* ============================================================
   NAVIGATION BETWEEN SCREENS
   ============================================================ */
let currentPage = 1;
function initNavigation() {
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      goToPage(Number(btn.dataset.goto));
    });
  });
}

function goToPage(pageNum) {
  const next = document.querySelector(`.screen[data-page="${pageNum}"]`);
  const prev = document.querySelector(`.screen[data-page="${currentPage}"]`);
  if (!next || next === prev) return;

  prev.classList.remove("active");
  next.classList.add("active");
  currentPage = pageNum;
  updateProgressTrail(pageNum);

  // Trigger page-specific "on enter" animations.
  if (pageNum === 2) playLetterAnimation();
  if (pageNum === 3) armWhyCardObserver();
  if (pageNum === 7) playFinaleIntro();

  // Scroll the new screen to the top for long content on small phones.
  next.scrollTop = 0;
}

/* ============================================================
   PAGE 1 — THE QUESTION (the famous dodging NO button)
   ============================================================ */
function initQuestionPage() {
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const btnField = document.getElementById("btn-field");
  const msgEl = document.getElementById("question-msg");

  const dodgeMessages = [
    "Are you sure? 🥺",
    "Think again...",
    "Nice try 😂❤️",
    "Nope, that option isn't available!",
    "You only have one correct answer 😌❤️",
  ];

  let attempts = 0;
  const MAX_ATTEMPTS = 5; // after this many dodges, NO vanishes for good

  function dodge() {
    attempts += 1;
    msgEl.textContent = dodgeMessages[Math.min(attempts - 1, dodgeMessages.length - 1)];

    if (attempts >= MAX_ATTEMPTS) {
      noBtn.classList.add("hidden-no");
      noBtn.style.opacity = "0";
      noBtn.style.transform = "scale(.4)";
      noBtn.setAttribute("aria-hidden", "true");
      noBtn.disabled = true;
      msgEl.textContent = "Only YES was ever on the menu 😌❤️";
      // Return the button to the layout flow instead of floating, so it
      // doesn't leave an invisible hit target behind.
      window.setTimeout(() => {
        noBtn.style.display = "none";
      }, 400);
      return;
    }

    // Move the NO button to a new random-but-safe position within the
    // button field (works identically for mouse hover and touch).
    const fieldRect = btnField.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = Math.max(fieldRect.width - btnRect.width, 20);
    const maxY = Math.max(fieldRect.height - btnRect.height, 20);

    const newX = fieldRect.left + Math.random() * maxX;
    const newY = fieldRect.top + Math.random() * maxY;

    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
  }

  // Prevent the "NO" button from ever completing a click/tap: we intercept
  // the earliest possible event (pointerdown/touchstart) and dodge before
  // a full click can register, on both desktop and mobile.
  ["pointerenter", "pointerdown", "touchstart", "click"].forEach((evt) => {
    noBtn.addEventListener(
      evt,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        dodge();
      },
      { passive: false }
    );
  });

  yesBtn.addEventListener("click", () => {
    celebrateYes();
    window.setTimeout(() => goToPage(2), 900);
  });
}

function celebrateYes() {
  const layer = document.getElementById("burst-layer");
  const emojis = ["❤️", "💖", "💕", "✨", "🥹"];
  const pieces = window.innerWidth < 600 ? 26 : 40;

  for (let i = 0; i < pieces; i++) {
    const span = document.createElement("span");
    span.className = "burst-heart";
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 220;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    span.style.fontSize = `${14 + Math.random() * 18}px`;
    span.style.transition = `transform ${0.8 + Math.random() * 0.6}s cubic-bezier(.22,.68,.29,1.01), opacity 1.2s ease-out`;
    layer.appendChild(span);

    requestAnimationFrame(() => {
      span.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`;
      span.style.opacity = "0";
    });

    window.setTimeout(() => span.remove(), 1800);
  }
}

/* ============================================================
   PAGE 2 — LETTER (fade-in line by line)
   ============================================================ */
let letterPlayed = false;
function initLetterPage() {
  const el = document.getElementById("letter-text");
  el.innerHTML = letterLines
    .map((line, i) => `<span class="line" style="animation-delay:${0.25 * i + 0.15}s">${escapeHTML(line)}</span>`)
    .join("<br>");
}
function playLetterAnimation() {
  // Lines are pure-CSS animated on insert; nothing else required, but we
  // guard so re-visiting the page doesn't feel broken (it just replays).
  if (letterPlayed) return;
  letterPlayed = true;
}
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   PAGE 3 — WHY YOU (cards animate in one by one)
   ============================================================ */
let whyObserverArmed = false;
function initWhyCards() {
  // Give every card a stagger delay up front.
  document.querySelectorAll(".why-card").forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });
}
function armWhyCardObserver() {
  if (whyObserverArmed) return;
  whyObserverArmed = true;
  const cards = document.querySelectorAll(".why-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach((card) => observer.observe(card));
}

/* ============================================================
   PAGE 4 — MEMORIES GALLERY + LIGHTBOX
   ============================================================ */
function initGallery() {
  const gallery = document.getElementById("gallery");
  const tilts = [-4, 3, -2, 5, -3, 2, -5, 4];

  photos.forEach((photo, i) => {
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.style.setProperty("--tilt", `${tilts[i % tilts.length]}deg`);
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", `Open photo: ${photo.caption}`);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = "lazy";
    // Graceful fallback if a placeholder file doesn't exist yet.
    img.addEventListener("error", () => {
      img.style.display = "none";
      fig.style.setProperty("--fallback", "1");
    });

    const caption = document.createElement("figcaption");
    caption.textContent = photo.caption;

    fig.appendChild(img);
    fig.appendChild(caption);
    gallery.appendChild(fig);

    const open = () => openLightbox(photo.src, photo.caption);
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

function openLightbox(src, caption) {
  const lightbox = document.getElementById("lightbox");
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox-img").alt = caption;
  document.getElementById("lightbox-caption").textContent = caption;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

/* ============================================================
   PAGE 5 — ENVELOPE
   ============================================================ */
function initEnvelope() {
  const envelope = document.getElementById("envelope");
  const continueBtn = document.getElementById("page5-continue");

  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("open")) return;
    envelope.classList.add("open");
    spawnFloatingHearts(14);
    window.setTimeout(() => continueBtn.classList.add("shown"), 500);
  });
}

function spawnFloatingHearts(count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "❤️";
    heart.style.left = `${10 + Math.random() * 80}vw`;
    heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);
    heart.style.setProperty("--rot", `${(Math.random() - 0.5) * 60}deg`);
    heart.style.animationDuration = `${3.5 + Math.random() * 2}s`;
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 6000);
  }
}

/* ============================================================
   PAGE 6 — CAKE + CANDLES
   ============================================================ */
function initCake() {
  const candles = document.querySelectorAll(".candle");
  const smokeLayer = document.getElementById("smoke-layer");
  const hint = document.getElementById("cake-hint");
  const wishLine1 = document.getElementById("wish-line-1");
  const wishLine2 = document.getElementById("wish-line-2");
  const wishLine3 = document.getElementById("wish-line-3");
  const continueBtn = document.getElementById("page6-continue");

  let blownCount = 0;

  candles.forEach((candle) => {
    candle.addEventListener("click", () => blow(candle));
  });

  function blow(candle) {
    if (candle.classList.contains("blown")) return;
    candle.classList.add("blown");
    blownCount += 1;

    // little puff of smoke
    for (let i = 0; i < 5; i++) {
      const bit = document.createElement("span");
      bit.className = "smoke-bit";
      const rect = candle.getBoundingClientRect();
      const sceneRect = smokeLayer.getBoundingClientRect();
      bit.style.left = `${rect.left - sceneRect.left + rect.width / 2}px`;
      bit.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
      bit.style.animationDelay = `${i * 0.06}s`;
      smokeLayer.appendChild(bit);
      window.setTimeout(() => bit.remove(), 1800);
    }

    if (blownCount === candles.length) {
      hint.style.opacity = "0";
      spawnFloatingHearts(18);
      wishLine1.classList.add("shown");
      window.setTimeout(() => wishLine2.classList.add("shown"), 1200);
      window.setTimeout(() => wishLine3.classList.add("shown"), 2400);
      window.setTimeout(() => continueBtn.classList.add("shown"), 3200);
    }
  }
}

/* ============================================================
   PAGE 7 — FINALE
   ============================================================ */
function initFinale() {
  // Scatter a handful of twinkling "stars" behind the finale text.
  const sky = document.getElementById("finale-sky");
  const STAR_COUNT = window.innerWidth < 600 ? 20 : 34;
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("span");
    star.className = "finale-star";
    const size = 1 + Math.random() * 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    sky.appendChild(star);
  }

  document.getElementById("final-btn").addEventListener("click", (e) => {
    document.getElementById("finale-hidden").classList.add("shown");
    e.target.style.display = "none";
    spawnFloatingHearts(10);
  });
}

let finalePlayed = false;
function playFinaleIntro() {
  if (finalePlayed) return;
  finalePlayed = true;
  const sequence = document.getElementById("finale-sequence");
  window.setTimeout(() => sequence.classList.add("shown"), 2400);
}

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
function initMusic() {
  const btn = document.getElementById("music-toggle");
  const label = document.getElementById("music-label");
  const icon = btn.querySelector("i");
  const audio = document.getElementById("bg-music");
  audio.src = musicFile;

  let playing = false;
  btn.addEventListener("click", () => {
    if (!playing) {
      audio.play().catch(() => {
        // If the browser blocks playback (e.g. no file present yet),
        // fail silently rather than breaking the experience.
      });
      playing = true;
      label.textContent = "Mute Music";
      icon.className = "fa-solid fa-volume-high";
      btn.setAttribute("aria-pressed", "true");
    } else {
      audio.pause();
      playing = false;
      label.textContent = "Play Music";
      icon.className = "fa-solid fa-music";
      btn.setAttribute("aria-pressed", "false");
    }
  });
}
