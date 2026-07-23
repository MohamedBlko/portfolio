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
  let nodes = [];
  let animationFrame = 0;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(28, Math.min(72, Math.floor((width * height) / 18000)));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: (index * 89) % width,
      y: (index * 137) % height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 1 + Math.random() * 1.8,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const px = pointer.x * width;
    const py = pointer.y * height;

    nodes.forEach((node) => {
      if (!prefersReducedMotion) {
        node.x += node.vx + (px - width / 2) * 0.00005;
        node.y += node.vy + (py - height / 2) * 0.00005;
      }

      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < 150) {
          const opacity = (1 - distance / 150) * 0.24;
          ctx.strokeStyle = `rgba(61, 214, 198, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      const distanceToPointer = Math.hypot(node.x - px, node.y - py);
      const glow = Math.max(0, 1 - distanceToPointer / 260);

      ctx.fillStyle = glow > 0 ? `rgba(255, 159, 69, ${0.35 + glow * 0.5})` : "rgba(247, 239, 226, 0.42)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r + glow * 2.4, 0, Math.PI * 2);
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
