// ==========================================================================
// 1. NAVIGATION & GLOBAL STATE
// ==========================================================================
const welcomeScreen = document.getElementById("welcome-screen");
const startButton = document.getElementById("start-button");
const dashboardScreen = document.getElementById("dashboard-screen");
const adventureContent = document.getElementById("adventure-content");
const backToHomeBtn = document.getElementById("back-to-home-btn");

let isGalleryUnlocked = false;
let isGuessUnlocked = false;
let isBoothUnlocked = false;

// ==========================================================================
// 2. DASHBOARD
// ==========================================================================
function showDashboard() {
  welcomeScreen.classList.add("hidden");
  dashboardScreen.classList.remove("hidden");
  adventureContent.classList.add("hidden");

  document.getElementById("quest-section").classList.add("hidden");
  document.getElementById("nature-section").classList.add("hidden");
  document.getElementById("guess-screen").classList.add("hidden");
  document.getElementById("scrapbook-screen").classList.add("hidden");
  document.getElementById("booth-screen").classList.add("hidden");
  document.getElementById("letter-screen").classList.add("hidden");

  const galleryCard = document.getElementById("gallery-card");
  if (isGalleryUnlocked && galleryCard) {
    galleryCard.classList.remove("locked-card");
    const cardIcon = galleryCard.querySelector(".card-icon");
    if (cardIcon) cardIcon.textContent = "🌸";
    const subText = galleryCard.querySelector("p");
    if (subText) subText.textContent = "A beautiful gallery of memories.";
  }

  const guessCard = document.getElementById("guess-card");
  if (isGuessUnlocked && guessCard) {
    guessCard.classList.remove("locked-card");
    const cardIcon = guessCard.querySelector(".card-icon");
    if (cardIcon) cardIcon.textContent = "📸";
    const subText = guessCard.querySelector("p");
    if (subText) subText.textContent = "Guess the little memories.";
  }

  const boothCard = document.getElementById("booth-card");
  if (isBoothUnlocked && boothCard) {
    boothCard.classList.remove("locked-card");
    const cardIcon = boothCard.querySelector(".card-icon");
    if (cardIcon) cardIcon.textContent = "🎀";
    const subText = boothCard.querySelector("p");
    if (subText) subText.textContent = "Your little photo collection.";
  }

  window.scrollTo(0, 0);
}

if (startButton) startButton.addEventListener("click", showDashboard);

if (backToHomeBtn) {
  backToHomeBtn.addEventListener("click", () => {
    dashboardScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
    window.scrollTo(0, 0);
  });
}

document.querySelectorAll(".adventure-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.id === "gallery-card" && !isGalleryUnlocked) {
      alert("🐾 Piko Piki says: Solve the Detective Desk riddles first!");
      return;
    }
    if (card.id === "guess-card" && !isGuessUnlocked) {
      alert("🐾 Piko Piki says: Complete Through Your Lens first!");
      return;
    }
    if (card.id === "booth-card" && !isBoothUnlocked) {
      alert("🐾 Piko Piki says: Complete Guess a Memory first to unlock your photo booth!");
      return;
    }

    const targetId = card.dataset.target;
    dashboardScreen.classList.add("hidden");

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove("hidden");
      if (targetId === "guess-screen") {
        curGuess = 0;
        renderGuessLevel();
      }
    }
    window.scrollTo(0, 0);
  });
});

document.querySelectorAll(".back-button").forEach((button) => {
  button.addEventListener("click", showDashboard);
});

// ==========================================================================
// 3. DETECTIVE DESK
// ==========================================================================
const questData = [
  {
    title: "The First Little Mystery",
    question: "I'm full of pages, but I'm not a tree. What am I?",
    options: [
      { text: "A flower", answer: "flower" },
      { text: "A book", answer: "book" },
      { text: "A cloud", answer: "cloud" }
    ],
    correct: "book",
    success: "Correct! 📖 Every adventure begins with a story."
  },
  {
    title: "The Capture Clue",
    question: "I capture moments, but I'm not a thief. What am I?",
    options: [
      { text: "A camera", answer: "camera" },
      { text: "A mirror", answer: "mirror" },
      { text: "A shadow", answer: "shadow" }
    ],
    correct: "camera",
    success: "Wonderful! 📷 You have a great eye for memories."
  },
  {
    title: "The Final Little Clue",
    question: "I keep moments safe, even after the moment has passed. What am I?",
    options: [
      { text: "A memory", answer: "memory" },
      { text: "A raindrop", answer: "raindrop" },
      { text: "A shadow", answer: "shadow" }
    ],
    correct: "memory",
    success: "You did it! 🐾 You've found all three clues."
  }
];

let currentQuest = 0;
let questCompleted = 0;

const questTitle = document.getElementById("quest-title");
const questQuestion = document.getElementById("quest-question");
const questOptions = document.getElementById("quest-options");
const questFeedback = document.getElementById("quest-feedback");
const questNext = document.getElementById("quest-next");
const questProgressText = document.getElementById("quest-progress-text");
const questScore = document.getElementById("quest-score");
const questProgressFill = document.getElementById("quest-progress-fill");

function renderQuest() {
  const clue = questData[currentQuest];
  if (!questTitle) return;

  questTitle.textContent = clue.title;
  questQuestion.textContent = clue.question;
  questOptions.innerHTML = "";
  questFeedback.textContent = "";
  questFeedback.classList.remove("wrong");
  questNext.classList.add("hidden");

  questProgressText.textContent = `Clue ${currentQuest + 1} of ${questData.length}`;
  questScore.textContent = `${questCompleted} / ${questData.length} found`;
  questProgressFill.style.width = `${(questCompleted / questData.length) * 100}%`;

  clue.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.textContent = option.text;

    button.addEventListener("click", () => {
      const allOptions = questOptions.querySelectorAll("button");

      if (option.answer === clue.correct) {
        allOptions.forEach((item) => (item.disabled = true));
        if (questCompleted <= currentQuest) questCompleted++;

        questFeedback.textContent = clue.success;
        questFeedback.classList.remove("wrong");

        questScore.textContent = `${questCompleted} / ${questData.length} found`;
        questProgressFill.style.width = `${(questCompleted / questData.length) * 100}%`;

        questNext.textContent =
          currentQuest === questData.length - 1
            ? "Unlock Through Your Lens →"
            : "Next clue →";

        questNext.classList.remove("hidden");
      } else {
        questFeedback.textContent = "Not quite! 🐾 Try another answer.";
        questFeedback.classList.add("wrong");
      }
    });

    questOptions.appendChild(button);
  });
}

if (questNext) {
  questNext.addEventListener("click", () => {
    if (currentQuest < questData.length - 1) {
      currentQuest++;
      renderQuest();
    } else {
      isGalleryUnlocked = true;
      currentQuest = 0;
      questCompleted = 0;
      renderQuest();
      showDashboard();
    }
  });
}

renderQuest();

// ==========================================================================
// 4. THROUGH YOUR LENS → Unlock Guess
// ==========================================================================
const unlockGuessBtn = document.getElementById("unlock-guess-btn");
if (unlockGuessBtn) {
  unlockGuessBtn.addEventListener("click", () => {
    isGuessUnlocked = true;
    showDashboard();
  });
}

// ==========================================================================
// 5. GUESS A MEMORY (serial reveal)
// ==========================================================================
const guessData = [
  {
    imgId: "guess-pic-1",
    q: "Where is this little friend hiding?",
    options: [
      { text: "In the leaves", ans: "l" },
      { text: "On a sofa", ans: "s" },
      { text: "Under a bed", ans: "b" }
    ],
    correct: "l",
    success: "Correct! 🌿 A tiny explorer in the green.",
    caption: "01 · A tiny explorer in the green."
  },
  {
    imgId: "guess-pic-2",
    q: "What is this kitten doing?",
    options: [
      { text: "Sunbathing", ans: "sun" },
      { text: "Playing with a toy", ans: "p" },
      { text: "Running away", ans: "r" }
    ],
    correct: "sun",
    success: "Wonderful! ☀️ Sunbathing, like a little queen.",
    caption: "02 · Sunbathing, like a little queen."
  }
];

let curGuess = 0;

function renderGuessLevel() {
  const current = guessData[curGuess];

  const currentPic = document.getElementById(current.imgId);
  if (currentPic) currentPic.style.filter = "blur(20px)";

  if (curGuess === 1) {
    const pic1 = document.getElementById("guess-pic-1");
    if (pic1) pic1.style.filter = "blur(0px)";
  }

  document.getElementById("guess-question-text").textContent = current.q;
  const optsBox = document.getElementById("guess-options-box");
  optsBox.innerHTML = "";
  const feed = document.getElementById("guess-feedback");
  feed.textContent = "";
  feed.classList.remove("wrong");

  const nextB = document.getElementById("guess-next-btn");
  nextB.classList.add("hidden");

  document.getElementById("guess-progress-text").textContent = `Photo ${curGuess + 1} of 2`;
  document.getElementById("guess-score").textContent = `${curGuess} / 2 revealed`;
  document.getElementById("guess-progress-fill").style.width = `${(curGuess / 2) * 100}%`;

  current.options.forEach((opt) => {
    const b = document.createElement("button");
    b.className = "answer-option";
    b.textContent = opt.text;

    b.addEventListener("click", () => {
      const allButtons = optsBox.querySelectorAll("button");
      if (opt.ans === current.correct) {
        allButtons.forEach((btn) => (btn.disabled = true));
        document.getElementById(current.imgId).style.filter = "blur(0px)";
        feed.textContent = current.success;
        feed.classList.remove("wrong");

        nextB.classList.remove("hidden");
        nextB.textContent = curGuess === guessData.length - 1
          ? "Proceed to Scrapbook →"
          : "Guess Next Photo →";
      } else {
        feed.textContent = "Not quite right! 🐾 Take another guess.";
        feed.classList.add("wrong");
      }
    });
    optsBox.appendChild(b);
  });
}

const guessNextBtnEl = document.getElementById("guess-next-btn");
if (guessNextBtnEl) {
  guessNextBtnEl.addEventListener("click", () => {
    if (curGuess < guessData.length - 1) {
      curGuess++;
      renderGuessLevel();
    } else {
      document.getElementById("guess-screen").classList.add("hidden");
      document.getElementById("scrapbook-screen").classList.remove("hidden");
      openScrapbookMode();
    }
  });
}

// ==========================================================================
// 6. SCRAPBOOK
// ==========================================================================
function openScrapbookMode() {
  document.getElementById("canvas-decorations").innerHTML = "";
  document.getElementById("scrapbook-canvas").className = "scrapbook-paper";

  document.getElementById("scrapbook-pic-1").src = "assets/cat-1.jpg";
  document.getElementById("scrapbook-pic-2").src = "assets/cat-2.jpg";
}

document.querySelectorAll(".tool-btn").forEach((btn) => {
  if (btn.id === "add-note-btn" || btn.id === "clear-stickers-btn" || btn.id === "clear-notes-btn") return;
  btn.addEventListener("click", () => {
    const cDec = document.getElementById("canvas-decorations");
    if (!cDec) return;

    const s = document.createElement("span");
    s.className = "placed-sticker";
    s.textContent = btn.dataset.val;
    s.style.left = `${Math.random() * 70 + 15}%`;
    s.style.top = `${Math.random() * 70 + 15}%`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "sticker-remove";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      s.remove();
      document.querySelectorAll(".placed-sticker.active, .memory-note.active").forEach((el) => {
        el.classList.remove("active");
      });
    });
    s.appendChild(removeBtn);

    s.addEventListener("mousedown", startDrag);
    s.addEventListener("touchstart", startDrag, { passive: false });
    s.addEventListener("click", (e) => {
      if (e.target.classList.contains("sticker-remove")) return;
      document.querySelectorAll(".placed-sticker, .memory-note").forEach((el) => el.classList.remove("active"));
      s.classList.add("active");
    });

    cDec.appendChild(s);
  });
});

let draggedElement = null;

function startDrag(e) {
  if (e.target.classList.contains("sticker-remove")) return;
  draggedElement = e.currentTarget;

  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
}

function drag(e) {
  if (!draggedElement) return;
  e.preventDefault();

  const touch = e.touches ? e.touches[0] : e;
  const canvas = document.getElementById("scrapbook-canvas");
  const canvasRect = canvas.getBoundingClientRect();

  const x = ((touch.clientX - canvasRect.left) / canvasRect.width) * 100;
  const y = ((touch.clientY - canvasRect.top) / canvasRect.height) * 100;

  draggedElement.style.left = `${Math.max(0, Math.min(100, x))}%`;
  draggedElement.style.top = `${Math.max(0, Math.min(100, y))}%`;
}

function stopDrag() {
  draggedElement = null;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
}

document.querySelectorAll(".frame-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const canvas = document.getElementById("scrapbook-canvas");
    if (canvas) {
      canvas.className = "scrapbook-paper";
      if (btn.dataset.frame !== "clear") {
        canvas.classList.add(`frame-${btn.dataset.frame}`);
      }
    }

    document.querySelectorAll(".polaroid").forEach((p) => {
      p.classList.remove("frame-polaroid", "frame-rounded", "frame-vintage");
      if (btn.dataset.frame !== "clear") {
        p.classList.add(`frame-${btn.dataset.frame}`);
      }
    });
  });
});

const addNoteBtn = document.getElementById("add-note-btn");
if (addNoteBtn) {
  addNoteBtn.addEventListener("click", () => {
    const input = document.getElementById("memory-note-input");
    const text = input.value.trim();
    if (!text) {
      alert("Write a little note first! 💌");
      return;
    }

    const cDec = document.getElementById("canvas-decorations");
    const note = document.createElement("div");
    note.className = "memory-note";
    note.textContent = text;
    note.style.left = `${Math.random() * 50 + 25}%`;
    note.style.top = `${Math.random() * 40 + 30}%`;
    note.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "sticker-remove";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      note.remove();
      document.querySelectorAll(".placed-sticker.active, .memory-note.active").forEach((el) => {
        el.classList.remove("active");
      });
    });
    note.appendChild(removeBtn);

    note.addEventListener("mousedown", startDrag);
    note.addEventListener("touchstart", startDrag, { passive: false });
    note.addEventListener("click", (e) => {
      if (e.target.classList.contains("sticker-remove")) return;
      document.querySelectorAll(".placed-sticker, .memory-note").forEach((el) => el.classList.remove("active"));
      note.classList.add("active");
    });

    cDec.appendChild(note);
    input.value = "";
  });
}

const clearStickersBtn = document.getElementById("clear-stickers-btn");
if (clearStickersBtn) {
  clearStickersBtn.addEventListener("click", () => {
    document.querySelectorAll(".placed-sticker").forEach((s) => s.remove());
  });
}

const clearNotesBtn = document.getElementById("clear-notes-btn");
if (clearNotesBtn) {
  clearNotesBtn.addEventListener("click", () => {
    document.querySelectorAll(".memory-note").forEach((n) => n.remove());
  });
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".placed-sticker") && !e.target.closest(".memory-note")) {
    document.querySelectorAll(".placed-sticker.active, .memory-note.active").forEach((el) => {
      el.classList.remove("active");
    });
  }
});

const scrapbookFinishBtnEl = document.getElementById("scrapbook-finish-btn");
if (scrapbookFinishBtnEl) {
  scrapbookFinishBtnEl.addEventListener("click", () => {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("span");
        sparkle.className = "sparkle";
        sparkle.textContent = ["✨", "⭐", "💫", "🌟"][Math.floor(Math.random() * 4)];
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1500);
      }, i * 80);
    }

    setTimeout(() => {
      isBoothUnlocked = true;
      curGuess = 0;
      renderGuessLevel();
      showDashboard();
    }, 1600);
  });
}

// ==========================================================================
// 7. FINAL LETTER + MUSIC
// ==========================================================================
const envelopeWrapper = document.getElementById("envelope-wrapper");
const envelope = document.getElementById("envelope");
const letterWrapper = document.getElementById("letter-wrapper");

const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");

let isMusicPlaying = false;

// 🎵 Song configuration — 0 sec theke 1:02 (62 sec) porjonto
const SONG_START_TIME = 0;    // Start from beginning
const SONG_END_TIME = 62;     // Stop at 1:02

function playMusic() {
  if (!bgMusic) return;

  // Start from specific time
  bgMusic.currentTime = SONG_START_TIME;
  bgMusic.volume = 0.45;

  bgMusic.play().then(() => {
    isMusicPlaying = true;
    musicToggle.classList.add("playing");
    musicIcon.textContent = "🎵";
  }).catch((err) => console.log("Play failed:", err));
}

function pauseMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  isMusicPlaying = false;
  musicToggle.classList.remove("playing");
  musicIcon.textContent = "🔇";
}

// 🎵 Auto-stop at 1:02
if (bgMusic) {
  bgMusic.addEventListener("timeupdate", () => {
    if (bgMusic.currentTime >= SONG_END_TIME) {
      bgMusic.pause();
      isMusicPlaying = false;
      musicToggle.classList.remove("playing");
      musicIcon.textContent = "🔇";
    }
  });
}

if (musicToggle) {
  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isMusicPlaying ? pauseMusic() : playMusic();
  });
}

if (envelopeWrapper && envelope && letterWrapper) {
  envelopeWrapper.addEventListener("click", () => {
    if (!isMusicPlaying) playMusic();

    envelope.classList.add("open");
    envelopeWrapper.classList.add("opened");

    setTimeout(() => {
      envelopeWrapper.style.display = "none";
      letterWrapper.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  });
}

const finishBtn = document.getElementById("finish-btn");
if (finishBtn) {
  finishBtn.addEventListener("click", () => {
    document.getElementById("booth-screen").classList.add("hidden");
    document.getElementById("letter-screen").classList.remove("hidden");
    window.scrollTo(0, 0);
  });
}

renderGuessLevel();