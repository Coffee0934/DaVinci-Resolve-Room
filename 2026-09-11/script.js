document.querySelector("form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  const button = event.currentTarget.querySelector("button");
  if (input?.validity.valid) {
    button.textContent = "고마워요!";
    input.value = "";
  } else {
    input?.focus();
  }
});


document.querySelectorAll(".tip-card-link").forEach((card) => {
  const openLink = () => { window.location.href = card.dataset.link; };
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    openLink();
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLink();
    }
  });
});


// 운영체제 선택: 키 값은 HTML의 data-mac / data-windows에서 수정합니다.
const shortcutPlatform = document.querySelector(".shortcut-platform");

if (shortcutPlatform) {
  const controls = shortcutPlatform.querySelector(".shortcut-platform__buttons");
  const buttons = shortcutPlatform.querySelectorAll("[data-platform]");
  const status = shortcutPlatform.querySelector(".shortcut-platform__status");
  const keys = document.querySelectorAll(".shortcut-list .keycap[data-mac][data-windows]");

  const showPlatform = (platform) => {
    if (platform !== "mac" && platform !== "windows") return;

    keys.forEach((key) => {
      key.textContent = key.dataset[platform];
    });
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.platform === platform));
    });
    status.textContent = platform === "mac"
      ? "Mac 단축키 · ⌘는 Command 키입니다."
      : "Windows 단축키 · Ctrl은 Control 키입니다.";
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => showPlatform(button.dataset.platform));
  });
  showPlatform("mac");
  controls.hidden = false;
}

// 상세 패널 열기 / 닫기는 운영체제 선택과 독립적으로 동작합니다.
document.querySelectorAll(".shortcut-detail-toggle").forEach((button) => {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  button.addEventListener("click", () => {
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
    button.classList.toggle("is-open", willOpen);
  });
});
