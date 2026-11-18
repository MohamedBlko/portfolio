const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const canvas = document.querySelector("#field-canvas");
const hero3dCanvas = document.querySelector("#hero-3d-canvas");
const projectModal = document.querySelector("#project-modal");
const projectButtons = document.querySelectorAll(".project-open");
const closeProjectButtons = document.querySelectorAll("[data-close-project]");
const detailTabs = document.querySelectorAll(".detail-tab");
const simSlider = document.querySelector("#sim-slider");
const simCanvas = document.querySelector("#sim-canvas");
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const contactSubmit = contactForm.querySelector('button[type="submit"]');
  const contactStatus = document.querySelector("#contact-status");
  const validationMessage = (field) => {
    field.setCustomValidity("");
    const message = field.validity.valueMissing ? "Please complete this field." : field.validity.typeMismatch ? "Enter a valid email address." : "";
    field.setCustomValidity(window.portfolioI18n?.t(message) || message);
  };
  contactForm.addEventListener("invalid", (event) => validationMessage(event.target), true);
  contactForm.addEventListener("input", (event) => event.target.setCustomValidity?.(""));
  document.addEventListener("portfolio:language", () => {
    contactForm.querySelectorAll("input, textarea").forEach((field) => {
      if (field.validity.customError) validationMessage(field);
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (contactSubmit.disabled) return;

    const fields = new FormData(contactForm);
    fields.set("subject", fields.get("subject").trim() || "Portfolio inquiry");
    contactSubmit.disabled = true;
    contactStatus.textContent = "Sending your message...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fields,
      });

      if (response.ok) {
        contactForm.reset();
        contactStatus.textContent = "Thanks! Your message was sent.";
      } else if (response.status === 429) {
        contactStatus.textContent = "Too many requests. Please wait a moment and try again.";
      } else {
        contactStatus.textContent = "Your message could not be sent. Try again or use the email address on this page.";
      }
    } catch {
      contactStatus.textContent = "Could not confirm that your message was sent. Check your connection or email me directly.";
    } finally {
      contactSubmit.disabled = false;
    }
  });
}

const projectDetails = {
  chess: {
    type: "ELE3000 | Automation",
    title: "Automated Chess Board",
    summary:
      "Low-budget automated chess board concept focused on electromechanical constraints, position tracking, embedded control and reliable move execution.",
    visual: "plc",
    sim: "Move sequence",
    overview: [
      "Objective: automate board movement while keeping cost, complexity and reliability under control.",
      "Responsibilities: break down sensing, actuation, move logic, wiring and test constraints.",
      "Constraints: low budget, repeatability, alignment, user interaction and maintainable documentation.",
    ],
    docs: [
      "Software: C/C++ concepts, control logic, test tables and technical documentation.",
      "Engineering result: system decomposed into sensing, control, actuation and validation blocks.",
      "Recruiter value: shows mechatronics thinking, troubleshooting and pragmatic design decisions.",
    ],
    assets: [
      "Board concept photo or CAD sketch.",
      "Motion sequence diagram and wiring sketch.",
      "Test plan for piece detection and move repeatability.",
    ],
  },
  odroid: {
    type: "Linux | Embedded",
    title: "Odroid-C2 Embedded Linux Platform",
    summary:
      "Embedded Linux project using Odroid-C2 with CMake, menuconfig, Buildroot, Yocto Project and Doxygen documentation.",
    visual: "distribution",
    sim: "Build pipeline",
    overview: [
      "Objective: understand and document an embedded Linux workflow from configuration to build outputs.",
      "Responsibilities: organize build configuration, toolchain notes, source structure and documentation.",
      "Constraints: reproducibility, dependency tracking, target hardware limitations and readable setup steps.",
    ],
    docs: [
      "Tools: Odroid-C2, CMake, menuconfig, Buildroot, Yocto Project and Doxygen.",
      "Engineering result: build process documented so another technical user can reproduce it.",
      "Recruiter value: connects embedded systems, Linux, documentation and hardware-aware debugging.",
    ],
    assets: [
      "Build configuration screenshots.",
      "Doxygen output and README procedure.",
      "Architecture diagram for toolchain, board and application.",
    ],
  },
  qr: {
    type: "OpenCV | Vision",
    title: "QR to OpenCV Reader",
    summary:
      "Vision pipeline for QR detection using camera input, OpenCV processing and embedded-friendly documentation.",
    visual: "embedded",
    sim: "Detection signal",
    overview: [
      "Objective: read QR information from camera input and prepare the result for system use.",
      "Responsibilities: camera acquisition, detection flow, processing notes and validation cases.",
      "Constraints: lighting, camera alignment, processing speed and robust detection.",
    ],
    docs: [
      "Tools: OpenCV, camera input, QR detection and Doxygen-style documentation.",
      "Engineering result: detection pipeline explained with inputs, outputs and failure cases.",
      "Recruiter value: shows sensor integration, vision, embedded constraints and testing.",
    ],
    assets: [
      "Camera setup photo.",
      "Detection screenshots and sample QR inputs.",
      "Pipeline diagram and test notes.",
    ],
  },
  radio: {
    type: "ELE2000 | Communications",
    title: "FM Radio Station",
    summary: "Communication project covering FM radio concepts, modulation/demodulation, signal chain behavior and testing.",
    visual: "power",
    sim: "FM waveform",
    overview: [
      "Objective: build understanding of a radio communication chain from signal generation to reception.",
      "Responsibilities: document modulation, demodulation, signal path and test observations.",
      "Constraints: noise, bandwidth, tuning, component behavior and measurement clarity.",
    ],
    docs: [
      "Tools: lab instruments, signal analysis, modulation/demodulation theory and report writing.",
      "Engineering result: radio system explained as functional blocks with measured behavior.",
      "Recruiter value: demonstrates signal thinking and structured lab documentation.",
    ],
    assets: ["Block diagram.", "Signal captures.", "Lab report or measurement table."],
  },
  intercom: {
    type: "ELE2000 | Audio",
    title: "Intercom Project",
    summary: "Analog audio and communication project focused on signal path, amplification, testing and clear documentation.",
    visual: "plc",
    sim: "Audio signal",
    overview: [
      "Objective: create and validate a basic intercom communication path.",
      "Responsibilities: analyze audio stages, document wiring, verify signal behavior and prepare test notes.",
      "Constraints: gain, noise, signal clarity, wiring reliability and component limits.",
    ],
    docs: [
      "Tools: lab instruments, analog circuits, measurement tables and technical report.",
      "Engineering result: audio path described in stages with observed limitations.",
      "Recruiter value: shows practical analog troubleshooting and documentation.",
    ],
    assets: ["Circuit photo.", "Signal measurements.", "Audio chain block diagram."],
  },
  parking: {
    type: "ELE1000 | Digital logic",
    title: "Parking Lot Place Finder",
    summary: "Digital logic project using logic gates to detect and represent available spaces in a parking lot.",
    visual: "distribution",
    sim: "Logic states",
    overview: [
      "Objective: detect parking availability using logic gate combinations.",
      "Responsibilities: define input/output states, truth tables, logic diagrams and validation cases.",
      "Constraints: simple logic, reliable state representation and readable circuit explanation.",
    ],
    docs: [
      "Tools: logic gates, truth tables, digital circuit diagrams and test cases.",
      "Engineering result: problem converted into clear combinational logic.",
      "Recruiter value: demonstrates fundamentals in digital logic and structured reasoning.",
    ],
    assets: ["Truth table.", "Logic gate diagram.", "Demo or test matrix."],
  },
  rfid: {
    type: "Embedded | Sensors",
    title: "RFID Reading Module",
    summary: "RFID reading module for identification workflows, embedded interfaces and data acquisition.",
    visual: "power",
    sim: "Read pulses",
    overview: [
      "Objective: read RFID tags and make the identifier available to the application layer.",
      "Responsibilities: interface setup, read flow, test cases and documentation.",
      "Constraints: read distance, reliability, timing and data handling.",
    ],
    docs: [
      "Tools: RFID module, microcontroller or embedded interface, test table and report notes.",
      "Engineering result: sensor module documented from wiring to data output.",
      "Recruiter value: shows sensor integration and embedded debugging.",
    ],
    assets: ["Wiring photo.", "Read log.", "Interface diagram."],
  },
  shoe: {
    type: "Sensors | Product system",
    title: "Shoe Measuring Device",
    summary: "Measurement device concept using camera/sensor data, calibration and product-oriented documentation.",
    visual: "embedded",
    sim: "Measurement profile",
    overview: [
      "Objective: estimate shoe size or dimensions from sensor/camera information.",
      "Responsibilities: define calibration, measurement flow, point detection and documentation.",
      "Constraints: accuracy, repeatability, lighting, sensor placement and user workflow.",
    ],
    docs: [
      "Tools: camera or ToF concepts, OpenCV-style processing, calibration notes and UML documentation.",
      "Engineering result: product workflow structured into sensing, processing and output steps.",
      "Recruiter value: combines sensors, product thinking and technical documentation.",
    ],
    assets: ["Prototype image.", "Calibration notes.", "Measurement algorithm diagram."],
  },
  studio: {
    type: "Trolet | Shopify",
    title: "Photo Studio for Shopify Products",
    summary: "Operational project for product photo consistency, workflow structure and Shopify asset preparation.",
    visual: "distribution",
    sim: "Workflow throughput",
    overview: [
      "Objective: improve product photo workflow for Shopify product listings.",
      "Responsibilities: structure capture process, naming/export flow, data consistency and operational notes.",
      "Constraints: repeatability, image consistency, time per product and upload organization.",
    ],
    docs: [
      "Tools: Shopify workflow, CSV/import-export logic, scripts and structured file handling.",
      "Engineering result: repeatable process for product assets and e-commerce data.",
      "Recruiter value: shows process automation, practical tooling and business context.",
    ],
    assets: ["Studio setup photo.", "Workflow diagram.", "Before/after listing examples."],
  },
};

let activeProject = projectDetails.chess;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.querySelector(".sr-only").textContent = isOpen ? "Close navigation" : "Open navigation";
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.querySelector(".sr-only").textContent = "Open navigation";
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.querySelector(".sr-only").textContent = "Open navigation";
      navToggle.focus();
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
  if (!projectModal) return;

  activeProject = projectDetails[projectId] || projectDetails.motor;

  document.querySelector("#modal-type").textContent = activeProject.type;
  document.querySelector("#modal-title").textContent = activeProject.title;
  document.querySelector("#modal-summary").textContent = activeProject.summary;
  document.querySelector("#sim-title").textContent = activeProject.sim;

  const image = document.querySelector("#detail-image");
  if (image) {
    image.className = `detail-image ${activeProject.visual}`;
  }

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

async function initHero3d() {
  if (!hero3dCanvas) return;

  try {
    const THREE = await import("https://unpkg.com/three@0.160.0/build/three.module.js");
    const panel = hero3dCanvas.closest(".hub-panel");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: hero3dCanvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    const group = new THREE.Group();
    const mouse = { x: 0, y: 0 };
    let frameId = 0;

    scene.add(group);
    camera.position.set(8, 7, 9);
    camera.lookAt(0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const cyanMaterial = new THREE.MeshStandardMaterial({
      color: 0x4df5ff,
      emissive: 0x4df5ff,
      emissiveIntensity: 1.35,
      metalness: 0.25,
      roughness: 0.2,
    });
    const orangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffb020,
      emissive: 0xffb020,
      emissiveIntensity: 1.05,
      metalness: 0.2,
      roughness: 0.24,
    });
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0x9aa7b8,
      metalness: 0.62,
      roughness: 0.28,
    });
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x283244,
      metalness: 0.45,
      roughness: 0.36,
    });
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      emissive: 0x10345a,
      emissiveIntensity: 0.65,
      metalness: 0.72,
      roughness: 0.26,
    });

    scene.add(new THREE.AmbientLight(0x9aa7b8, 1.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x4df5ff, 28, 22);
    rimLight.position.set(-4, 3, 5);
    scene.add(rimLight);
    const warmLight = new THREE.PointLight(0xffb020, 16, 18);
    warmLight.position.set(4, 2, -4);
    scene.add(warmLight);

    function addBox(size, position, material) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
      mesh.position.set(position[0], position[1], position[2]);
      group.add(mesh);
      return mesh;
    }

    addBox([5.8, 0.32, 5.8], [0, -0.2, 0], baseMaterial);
    addBox([2.2, 1.55, 2.2], [0, 0.75, 0], coreMaterial);
    addBox([1.75, 0.32, 1.75], [0, 1.68, 0], cyanMaterial);

    for (let i = 0; i < 5; i += 1) {
      addBox([2.28, 0.035, 2.28], [0, 0.2 + i * 0.28, 0], cyanMaterial);
    }

    const islandPositions = [
      [-4.2, 0.05, -2.9],
      [4.1, 0.05, -2.55],
      [-4.35, 0.05, 2.45],
      [4.2, 0.05, 2.7],
      [0, 0.05, -4.25],
      [0, 0.05, 4.2],
    ];

    islandPositions.forEach((position, index) => {
      addBox([1.55, 0.25, 1.25], position, baseMaterial);
      const equipment = addBox(
        index % 2 === 0 ? [0.62, 0.9, 0.62] : [0.86, 0.58, 0.86],
        [position[0], 0.62, position[2]],
        index % 3 === 0 ? orangeMaterial : steelMaterial
      );
      equipment.rotation.y = index * 0.35;
    });

    const conductorMaterial = new THREE.LineBasicMaterial({
      color: 0x4df5ff,
      transparent: true,
      opacity: 0.68,
    });
    const towerMaterial = new THREE.LineBasicMaterial({
      color: 0xdce7f5,
      transparent: true,
      opacity: 0.86,
    });

    function addLine(points, material = conductorMaterial) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points.map((point) => new THREE.Vector3(...point)));
      const line = new THREE.Line(geometry, material);
      group.add(line);
      return line;
    }

    islandPositions.forEach((position) => {
      addLine([[0, 0.05, 0], [position[0] * 0.58, 0.08, position[2] * 0.58], [position[0], 0.09, position[2]]]);
    });

    const towerX = -4.2;
    const towerZ = 2.45;
    addLine([[towerX, 0.28, towerZ], [towerX, 2.2, towerZ], [towerX - 0.45, 1.05, towerZ], [towerX + 0.45, 1.05, towerZ], [towerX, 2.2, towerZ]], towerMaterial);
    addLine([[towerX - 0.65, 1.55, towerZ], [towerX + 0.65, 1.55, towerZ]], towerMaterial);
    addLine([[towerX - 0.5, 1.55, towerZ], [-1.2, 1.4, 1.4], [1.3, 1.3, 0.9], [4.2, 1.2, 2.7]], conductorMaterial);

    const nodeGeometry = new THREE.SphereGeometry(0.105, 20, 20);
    const nodes = [[0, 1.9, 0], ...islandPositions.map((position) => [position[0], 0.95, position[2]])].map((position, index) => {
      const node = new THREE.Mesh(nodeGeometry, index % 2 === 0 ? cyanMaterial : orangeMaterial);
      node.position.set(position[0], position[1], position[2]);
      group.add(node);
      return node;
    });

    const grid = new THREE.GridHelper(8.2, 16, 0x4df5ff, 0x34465f);
    grid.position.y = -0.015;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    group.add(grid);

    group.rotation.x = -0.18;
    group.rotation.y = -0.64;

    function resizeHero3d() {
      const rect = hero3dCanvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function animate(time = 0) {
      const t = time * 0.001;
      group.rotation.y = -0.64 + Math.sin(t * 0.22) * 0.08 + mouse.x * 0.12;
      group.rotation.x = -0.18 + Math.sin(t * 0.18) * 0.035 - mouse.y * 0.08;

      nodes.forEach((node, index) => {
        const scale = 1 + Math.sin(t * 2.1 + index) * 0.18;
        node.scale.setScalar(scale);
      });

      renderer.render(scene, camera);
      if (!reduceMotion) {
        frameId = requestAnimationFrame(animate);
      }
    }

    panel?.addEventListener("pointermove", (event) => {
      const rect = panel.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      mouse.y = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    });

    window.addEventListener("resize", resizeHero3d);
    resizeHero3d();
    panel?.classList.add("is-3d-ready");
    animate();
    window.addEventListener("beforeunload", () => cancelAnimationFrame(frameId));
  } catch (error) {
    hero3dCanvas.closest(".hub-panel")?.classList.add("is-3d-fallback");
  }
}

initHero3d();

if (canvas) {
  const ctx = canvas.getContext("2d");
  const pointer = { x: 0.5, y: 0.5 };
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;

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
      if (!reduceMotion) {
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

    if (!reduceMotion) {
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
