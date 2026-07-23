const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const canvas = document.querySelector("#field-canvas");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (canvas) {
  const ctx = canvas.getContext("2d");
  const pointer = { x: 0.5, y: 0.5 };
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function makeParticle(index) {
    const rail = index % 4;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      rail,
      charge: Math.random() > 0.5 ? 1 : -1,
      size: 1 + Math.random() * 2.4,
    };
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(34, Math.min(92, Math.floor((width * height) / 15000)));
    particles = Array.from({ length: count }, (_, index) => makeParticle(index));
  }

  function drawCircuitRails(time) {
    ctx.lineWidth = 1;

    for (let i = 0; i < 7; i += 1) {
      const y = (height / 8) * (i + 1);
      const pulse = (Math.sin(time * 0.0015 + i) + 1) / 2;
      ctx.strokeStyle = `rgba(77, 245, 255, ${0.05 + pulse * 0.09})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width * 0.22, y);
      ctx.lineTo(width * 0.29, y + 32);
      ctx.lineTo(width, y + 32);
      ctx.stroke();
    }
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    drawCircuitRails(time);

    const px = pointer.x * width;
    const py = pointer.y * height;

    particles.forEach((particle) => {
      if (!prefersReducedMotion) {
        const pull = particle.charge * 0.00006;
        particle.x += particle.vx + (px - particle.x) * pull;
        particle.y += particle.vy + (py - particle.y) * pull;
      }

      if (particle.x < -30) particle.x = width + 30;
      if (particle.x > width + 30) particle.x = -30;
      if (particle.y < -30) particle.y = height + 30;
      if (particle.y > height + 30) particle.y = -30;
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < 132) {
          const opacity = (1 - distance / 132) * 0.24;
          const color = a.rail === b.rail ? "77, 245, 255" : "255, 94, 196";
          ctx.strokeStyle = `rgba(${color}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((particle) => {
      const distanceToPointer = Math.hypot(particle.x - px, particle.y - py);
      const glow = Math.max(0, 1 - distanceToPointer / 240);
      const color = particle.charge > 0 ? "77, 245, 255" : "255, 94, 196";

      ctx.fillStyle = `rgba(${color}, ${0.42 + glow * 0.5})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size + glow * 2.8, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!prefersReducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / Math.max(1, width);
    pointer.y = event.clientY / Math.max(1, height);
  });

  resizeCanvas();
  draw();

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationFrame);
  });
}
