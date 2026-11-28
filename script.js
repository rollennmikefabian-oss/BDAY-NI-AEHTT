(() => {
  "use strict";

  // ---------------------------------------------------------
  // 1. Birthday login details (case-insensitive username).
  // This is only a playful reveal, not secure authentication.
  // ---------------------------------------------------------
  const LOGIN_USERNAME = "thea marie";
  const ACCEPTED_PASSWORDS = ["lavender", "lavander"];

  // ---------------------------------------------------------
  // 2. Find the elements used by the three screens.
  // ---------------------------------------------------------
  const stages = {
    login: document.getElementById("login-stage"),
    envelope: document.getElementById("envelope-stage"),
    letter: document.getElementById("letter-stage"),
  };

  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginError = document.getElementById("login-error");

  // Show/hide the password while keeping the text and focus in place.
  const passwordToggle = document.getElementById("toggle-password");
  passwordToggle.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    passwordToggle.textContent = isVisible ? "Show" : "Hide";
    passwordToggle.setAttribute("aria-pressed", String(!isVisible));
    passwordToggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    passwordInput.focus({ preventScroll: true });
  });

  const envelope = document.getElementById("envelope");
  const openButton = document.getElementById("open-button");
  const confettiButton = document.getElementById("more-confetti");
  const backButton = document.getElementById("reopen-envelope");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let isOpening = false;
  let letterTimer = null;
  let confettiTimer = null;
  let confettiLayer = null;

  function normalizeUsername(text) {
    return text.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function showStage(stageName) {
    Object.entries(stages).forEach(([name, section]) => {
      const visible = name === stageName;
      section.hidden = !visible;
      section.classList.toggle("active", visible);
    });

    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // ---------------------------------------------------------
  // 3. Validate the login and reveal the envelope.
  // ---------------------------------------------------------
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = normalizeUsername(usernameInput.value);
    const password = passwordInput.value.trim().toLowerCase();
    const loginIsValid =
      username === LOGIN_USERNAME && ACCEPTED_PASSWORDS.includes(password);

    if (!loginIsValid) {
      loginError.textContent = "These details don’t match. Please try again. ♡";
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    loginError.textContent = "";
    showStage("envelope");
    envelope.focus({ preventScroll: true });
  });

  // ---------------------------------------------------------
  // 4. Animate the envelope before revealing the letter.
  // ---------------------------------------------------------
  function openLetter() {
    if (isOpening) return;

    isOpening = true;
    envelope.classList.add("opening");
    envelope.disabled = true;
    openButton.disabled = true;

    letterTimer = window.setTimeout(() => {
      showStage("letter");
      isOpening = false;
      throwConfetti();
      confettiButton.focus({ preventScroll: true });
    }, prefersReducedMotion ? 0 : 1120);
  }

  function resetEnvelope() {
    window.clearTimeout(letterTimer);
    isOpening = false;
    envelope.classList.remove("opening");
    envelope.disabled = false;
    openButton.disabled = false;
    showStage("envelope");
    envelope.focus({ preventScroll: true });
  }

  envelope.addEventListener("click", openLetter);
  openButton.addEventListener("click", openLetter);
  backButton.addEventListener("click", resetEnvelope);

  // ---------------------------------------------------------
  // 5. Lavender confetti! Reuse one layer to avoid piling up.
  // ---------------------------------------------------------
  function throwConfetti() {
    if (prefersReducedMotion) return;

    if (confettiLayer) confettiLayer.remove();
    window.clearTimeout(confettiTimer);

    const colors = [
      "#a88bd1", "#d6bee9", "#e9acd6", "#f5d5aa",
      "#c2a0dd", "#a78ebf", "#e0c6f6",
    ];

    confettiLayer = document.createElement("div");
    confettiLayer.className = "confetti-layer";
    confettiLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(confettiLayer);

    const pieces = document.createDocumentFragment();

    for (let i = 0; i < 110; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece" + (i % 5 === 0 ? " round" : "");
      piece.style.left = `${(Math.random() * 100).toFixed(2)}%`;
      piece.style.setProperty("--c", colors[i % colors.length]);
      piece.style.setProperty("--duration", `${(2.8 + Math.random() * 2).toFixed(2)}s`);
      piece.style.setProperty("--delay", `${(Math.random() * 0.85).toFixed(2)}s`);
      piece.style.setProperty("--drift", `${((Math.random() - 0.5) * 240).toFixed(0)}px`);
      piece.style.setProperty("--spin", `${((Math.random() - 0.5) * 1100).toFixed(0)}deg`);
      pieces.appendChild(piece);
    }

    confettiLayer.appendChild(pieces);

    confettiTimer = window.setTimeout(() => {
      confettiLayer?.remove();
      confettiLayer = null;
    }, 6100);
  }

  confettiButton.addEventListener("click", throwConfetti);
})();
