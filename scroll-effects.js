// ============================================================
// 스크롤 시안 01 — 워크플로우의 현재 단계 표시
// 문구는 index.html, 색·크기·간격·속도는 scroll-effects.css에서 수정합니다.
// 휠/터치 입력을 가로채지 않고 브라우저의 기본 스크롤을 유지합니다.
// ============================================================
(() => {
  const section = document.querySelector("[data-scroll-workflow]");
  if (!section || !CSS.supports("overflow", "clip")) return;

  const steps = [...section.querySelectorAll(".steps > div")];
  const heading = section.querySelector(".workflow-heading");
  const currentLabel = section.querySelector("[data-workflow-current]");
  const totalLabel = section.querySelector("[data-workflow-total]");
  const track = section.querySelector(".workflow-progress__track");
  if (!steps.length || !heading || !currentLabel || !totalLabel || !track) return;

  const screen = window.matchMedia(
    "(min-width: 761px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)"
  );
  // 화면 높이의 45% 지점에 가장 가까운 단계가 강조됩니다. (0~1)
  const focusPoint = 0.45;
  const formatNumber = (number) => String(number).padStart(2, "0");
  totalLabel.textContent = formatNumber(steps.length);
  const markers = steps.map(() => {
    const marker = document.createElement("i");
    track.append(marker);
    return marker;
  });

  let current = -1;
  let enabled = false;
  let frame = 0;

  const showStep = (index) => {
    if (current === index) return;
    current = index;
    currentLabel.textContent = formatNumber(index + 1);
    steps.forEach((step, i) => step.classList.toggle("is-current", i === index));
    markers.forEach((marker, i) => {
      marker.classList.toggle("is-current", i === index);
      marker.classList.toggle("is-past", i < index);
    });
  };

  const update = () => {
    frame = 0;
    if (!enabled) return;
    const bounds = section.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;

    const focusY = window.innerHeight * focusPoint;
    let nearest = 0;
    let nearestDistance = Infinity;
    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - focusY);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    showStep(nearest);
  };

  const scheduleUpdate = () => {
    if (enabled && !frame) frame = requestAnimationFrame(update);
  };

  const configure = () => {
    enabled = screen.matches;
    section.classList.toggle("is-scroll-ready", enabled);

    // 글자를 확대했거나 제목을 길게 바꾼 경우에도 내용이 잘리지 않게 합니다.
    if (enabled && heading.getBoundingClientRect().height > window.innerHeight - 120) {
      enabled = false;
      section.classList.remove("is-scroll-ready");
    }

    if (enabled) {
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      update();
    } else {
      window.removeEventListener("scroll", scheduleUpdate);
      cancelAnimationFrame(frame);
      frame = 0;
      steps.forEach((step) => step.classList.remove("is-current"));
      current = -1;
    }
  };

  screen.addEventListener("change", configure);
  window.addEventListener("resize", configure, { passive: true });
  window.addEventListener("pageshow", configure);
  configure();
  document.fonts?.ready.then(configure);
})();
