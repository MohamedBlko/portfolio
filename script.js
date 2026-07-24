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
  motor: {
    type: "Automation | Motor control",
    title: "Industrial Motor Control Panel",
    summary:
      "Mini case study for a PLC-controlled motor cabinet used on a manufacturing line, with emphasis on safe sequence logic, I/O mapping, test procedure and maintainable documentation.",
    visual: "plc",
    sim: "PLC sequence",
    overview: [
      "Objective: design a motor control sequence for start, stop, fault handling and operator feedback.",
      "Responsibilities: electrical schematics, I/O list, PLC sequence logic, HMI status points and test checklist.",
      "Constraints: safety interlocks, production continuity, readable troubleshooting and clear commissioning notes.",
    ],
    docs: [
      "Software: Schneider PLC tools, HMI/SCADA concepts, Excel I/O tracking and technical reports.",
      "Engineering result: sequence structured into states and transitions for easier debugging and handover.",
      "Target metric: reduce troubleshooting time by documenting every input, output, alarm and permissive condition.",
    ],
    assets: [
      "Panel photo, control schematic, I/O table and PLC sequence diagram.",
      "Commissioning checklist with start/stop, fault reset and safety validation.",
      "Short screen recording of HMI status and motor sequence simulation.",
    ],
  },
  hotswap: {
    type: "Power electronics | Reliability",
    title: "Redundant Hot-Swap Power Supply",
    summary:
      "Engineering file for a removable redundant power supply with service continuity, protection, maintainability and validation constraints.",
    visual: "power",
    sim: "Load profile",
    overview: [
      "Objective: maintain load supply during source replacement or source fault.",
      "Responsibilities: block diagram, operating modes, failure cases, protection assumptions and validation plan.",
      "Constraints: reliability, thermal behavior, maintainability, protection coordination and service continuity.",
    ],
    docs: [
      "Software: LTspice/EasyEDA concepts, Excel calculations, MATLAB plots and structured documentation.",
      "Engineering result: clarified power paths, protection needs and test cases before physical implementation.",
      "Target metric: validate continuity of service under load steps and source transfer events.",
    ],
    assets: [
      "Electrical block diagram and power path diagram.",
      "Load table, protection assumptions and thermal notes.",
      "Simulation capture, validation report and design review notes.",
    ],
  },
  distribution: {
    type: "Power systems | Electrical design",
    title: "480V Distribution Study",
    summary:
      "Recruiter-style design study for a low-voltage distribution concept including load calculation, feeder sizing, protective device selection and documentation package.",
    visual: "distribution",
    sim: "Load demand",
    overview: [
      "Objective: prepare a 480V distribution concept for industrial or commercial loads.",
      "Responsibilities: load list, demand estimate, feeder sizing, single-line diagram and protection notes.",
      "Constraints: safety, voltage level, maintainability, expansion capacity and code-aware documentation.",
    ],
    docs: [
      "Software: AutoCAD Electrical target workflow, Excel calculation sheet, ETAP/EasyPower/SKM readiness.",
      "Engineering result: design package structure ready for review by a senior electrical engineer.",
      "Target metric: size feeders up to 600A and document assumptions for 250 kW-class installations.",
    ],
    assets: [
      "Single-line diagram, panel schedule and load calculation table.",
      "Protection device notes and grounding assumptions.",
      "PDF calculation package and drawing export.",
    ],
  },
};

let activeProject = projectDetails.motor;

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

  simCtx.strokeStyle = activeProject.visual === "power" ? "#ffb020" : activeProject.visual === "distribution" ? "#7da7ff" : "#4df5ff";
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
    } else if (activeProject.visual === "power") {
      y = mid - Math.sin(t * Math.PI) * (strength * 8) - Math.sin(t * Math.PI * 6) * 8;
    } else if (activeProject.visual === "distribution") {
      y = mid - 18 - Math.sin(t * Math.PI * 2) * (18 + strength * 3) - Math.sin(t * Math.PI * 9) * 5;
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
  activeProject = projectDetails[projectId] || projectDetails.motor;

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
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      rail,
      charge: Math.random() > 0.5 ? 1 : -1,
      size: 1 + Math.random() * 2,
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

    const count = Math.max(26, Math.min(70, Math.floor((width * height) / 19000)));
    particles = Array.from({ length: count }, (_, index) => makeParticle(index));
  }

  function drawCircuitRails(time) {
    ctx.lineWidth = 1;

    for (let i = 0; i < 6; i += 1) {
      const y = (height / 7) * (i + 1);
      const pulse = (Math.sin(time * 0.0012 + i) + 1) / 2;
      ctx.strokeStyle = `rgba(77, 245, 255, ${0.04 + pulse * 0.07})`;
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
        const pull = particle.charge * 0.000045;
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

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.18;
          const color = a.rail === b.rail ? "77, 245, 255" : "255, 176, 32";
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
      const color = particle.charge > 0 ? "77, 245, 255" : "255, 176, 32";

      ctx.fillStyle = `rgba(${color}, ${0.36 + glow * 0.45})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size + glow * 2.2, 0, Math.PI * 2);
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
