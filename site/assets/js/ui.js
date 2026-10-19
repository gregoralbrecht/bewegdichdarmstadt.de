// Small page widgets without dependencies (design D13).

// ---------- Join-mode picker: CSS shows the answer (works without JS); JS announces it ----------
for (const picker of document.querySelectorAll("[data-join]")) {
  const live = picker.querySelector("[data-join-live]");
  picker.addEventListener("change", (e) => {
    const answer = picker.querySelector(`.join__answer[data-for="${e.target.value}"]`);
    if (live && answer) live.textContent = answer.textContent;
  });
}

// ---------- Route draws itself when it scrolls into view (D12); full route without JS / reduced motion ----------
const route = document.querySelector("[data-route]");
if (route && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  route.classList.add("will-draw");
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    route.classList.add("is-drawn");
    io.disconnect();
  }, { threshold: 0.35 });
  io.observe(route);
}
