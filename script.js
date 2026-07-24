const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const canvas = document.querySelector("#field-canvas");
const projectModal = document.querySelector("#project-modal");
const projectButtons = document.querySelectorAll(".project-open");
const closeProjectButtons = document.querySelectorAll("[data-close-project]");
const detailTabs = document.querySelectorAll(".detail-tab");
const simSlider = document.querySelector("#sim-slider");
const simCanvas = document.querySelector("#sim-canvas");
const projectDetails = {
  plc: {
    type: "Automatisation industrielle",
    title: "PLC Schneider Modicon M340",
    summary:
      "Fiche interactive sur une architecture d'automatisation industrielle : logique de séquence, capteurs, actionneurs, HMI/SCADA, essais et documentation.",
    visual: "plc",
    sim: "Séquence PLC",
    overview: [
      "Montre la logique de contrôle comme une chaîne d'états plutôt qu'une simple description texte.",
      "Relie les entrées capteurs, sorties actionneurs, HMI/SCADA et documentation d'essais.",
      "Prépare l'ajout de captures HMI, ladder diagrams, tableaux d'E/S et rapports d'essais.",
    ],
    docs: [
      "Problème : structurer une séquence automatisée fiable et lisible.",
      "Méthode : décomposer le comportement en états, transitions, capteurs, actionneurs et conditions de sécurité.",
      "Résultat : documentation prête pour revue technique et validation terrain.",
    ],
    assets: [
      "Capture ladder/FBD/SFC.",
      "Table d'E/S et schéma de séquence.",
      "Rapport d'essais ou vidéo HMI/SCADA.",
    ],
  },
  hotswap: {
    type: "Alimentation redondante",
    title: "L3 MAPPS - Hot-Swap Power Supply",
    summary:
      "Fiche interactive sur la conception et l'analyse d'une alimentation redondante remplaçable à chaud avec contraintes de fiabilité, protection et maintenabilité.",
    visual: "power",
    sim: "Profil de charge",
    overview: [
      "Montre la continuité d'alimentation et la réponse à la variation de charge.",
      "Présente les contraintes de protection, fiabilité, validation et maintenance.",
      "Prépare l'ajout de schémas, hypothèses, calculs et captures de validation.",
    ],
    docs: [
      "Problème : maintenir le service pendant le remplacement ou la défaillance d'une source.",
      "Méthode : analyser les chemins d'alimentation, protections, contraintes thermiques et validation.",
      "Résultat : architecture documentée pour discussion technique et revue de conception.",
    ],
    assets: [
      "Schéma électrique ou bloc diagramme.",
      "Calculs de charge/protection.",
      "Rapport de validation et contraintes de fiabilité.",
    ],
  },
  odroid: {
    type: "Système embarqué",
    title: "ELE4205 - Système Odroid-C2",
    summary:
      "Fiche interactive sur un système embarqué C++ avec communication TCP/IP, OpenCV, caméra USB, ZBar/QR Code, GPIO, Docker, Yocto, CMake et documentation Doxygen.",
    visual: "embedded",
    sim: "Flux embarqué",
    overview: [
      "Montre le flux entre capteur, traitement, communication réseau et sortie système.",
      "Relie bas niveau, vision ordinateur, Linux embarqué et documentation technique.",
      "Prépare l'ajout de captures OpenCV, schémas d'architecture et dépôt de code.",
    ],
    docs: [
      "Problème : intégrer vision, communication et logique embarquée dans un système cohérent.",
      "Méthode : structurer les modules C++, réseau, traitement image, GPIO et documentation.",
      "Résultat : prototype explicable avec architecture, tests et traces de débogage.",
    ],
    assets: [
      "Capture OpenCV ou QR/ZBar.",
      "Diagramme d'architecture logicielle.",
      "Dépôt GitHub, Doxygen ou rapport de projet.",
    ],
  },
};
let activeProject = projectDetails.plc;

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

function setList(selector, items) {
  const list = document.querySelector(selector);
  if (!list) return;

  list.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    })
  );
}

function drawSimulation(level = 5) {
  if (!simCanvas) return;

  const simCtx = simCanvas.getContext("2d");
  const width = simCanvas.width;
  const height = simCanvas.height;
  const mid = height / 2;
  const strength = Number(level) || 5;

  simCtx.clearRect(0, 0, width, height);
  simCtx.fillStyle = "rgba(3, 5, 15, 0.65)";
  simCtx.fillRect(0, 0, width, height);

  simCtx.strokeStyle = "rgba(77, 245, 255, 0.12)";
  simCtx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    simCtx.beginPath();
    simCtx.moveTo(x, 0);
    simCtx.lineTo(x, height);
    simCtx.stroke();
  }
  for (let y = 20; y < height; y += 40) {
    simCtx.beginPath();
    simCtx.moveTo(0, y);
    simCtx.lineTo(width, y);
    simCtx.stroke();
  }

  simCtx.strokeStyle = activeProject.visual === "power" ? "#ffe66b" : activeProject.visual === "embedded" ? "#ff5ec4" : "#4df5ff";
  simCtx.lineWidth = 3;
  simCtx.shadowBlur = 16;
  simCtx.shadowColor = simCtx.strokeStyle;
  simCtx.beginPath();

  for (let x = 0; x < width; x += 1) {
    const t = x / width;
    let y;

    if (activeProject.visual === "plc") {
      const phase = Math.floor(t * (4 + strength * 0.4)) % 2;
      y = phase === 0 ? mid - 48 : mid + 42;
    } else if (activeProject.visual === "embedded") {
      const duty = 0.18 + strength * 0.065;
      y = t % 0.16 < duty * 0.16 ? mid - 58 : mid + 46;
    } else if (activeProject.visual === "power") {
      y = mid - Math.sin(t * Math.PI) * (strength * 8) - Math.sin(t * Math.PI * 6) * 8;
    } else {
      y = mid + Math.sin(t * Math.PI * (5 + strength * 0.3)) * Math.exp(-t * (1.4 + strength * 0.22)) * (40 + strength * 8);
    }

    if (x === 0) {
      simCtx.moveTo(x, y);
    } else {
      simCtx.lineTo(x, y);
    }
  }

  simCtx.stroke();
  simCtx.shadowBlur = 0;

  simCtx.fillStyle = "rgba(249, 251, 255, 0.78)";
  simCtx.font = "16px JetBrains Mono, Consolas, monospace";
  simCtx.fillText(`${activeProject.sim} | input ${strength}`, 18, 28);
}

function openProject(projectId) {
  activeProject = projectDetails[projectId] || projectDetails.plc;

  document.querySelector("#modal-type").textContent = activeProject.type;
  document.querySelector("#modal-title").textContent = activeProject.title;
  document.querySelector("#modal-summary").textContent = activeProject.summary;
  document.querySelector("#sim-title").textContent = activeProject.sim;

  const image = document.querySelector("#detail-image");
  image.className = `detail-image ${activeProject.visual}`;

  setList("#modal-overview", activeProject.overview);
  setList("#modal-docs", activeProject.docs);
  setList("#modal-assets", activeProject.assets);

  detailTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === "overview"));
  document.querySelectorAll(".detail-pane").forEach((pane) => pane.classList.toggle("is-active", pane.dataset.pane === "overview"));

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  drawSimulation(simSlider?.value || 5);
}

function closeProject() {
  if (!projectModal) return;
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

projectButtons.forEach((button) => {
  button.addEventListener("click", () => openProject(button.dataset.project));
});

closeProjectButtons.forEach((button) => {
  button.addEventListener("click", closeProject);
});

detailTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    detailTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    document.querySelectorAll(".detail-pane").forEach((pane) => pane.classList.toggle("is-active", pane.dataset.pane === tab.dataset.tab));
  });
});

simSlider?.addEventListener("input", () => drawSimulation(simSlider.value));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProject();
  }
});

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
