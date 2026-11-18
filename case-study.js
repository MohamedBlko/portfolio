const lightbox = document.querySelector("#image-lightbox");
if (lightbox && typeof lightbox.showModal === "function") {
  const preview = lightbox.querySelector("img");
  const caption = lightbox.querySelector("p");
  let trigger;
  let current = 0;
  const links = [...document.querySelectorAll("a[data-enlarge]")];
  const display = (index) => {
    current = (index + links.length) % links.length;
    const link = links[current];
    preview.src = link.href;
    preview.alt = window.portfolioI18n?.originalAttribute(link.querySelector("img"), "alt") || link.querySelector("img").alt;
    caption.textContent = `${current + 1} / ${links.length} - ${link.dataset.caption || preview.alt}`;
  };
  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      trigger = link;
      display(index);
      lightbox.showModal();
    });
  });
  lightbox.querySelector("button").addEventListener("click", () => lightbox.close());
  if (links.length > 1) {
    const controls = document.createElement("div");
    controls.className = "lightbox-paging";
    for (const [label, symbol, step] of [["Previous image", "\u2190", -1], ["Next image", "\u2192", 1]]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lightbox-close";
      button.textContent = symbol;
      button.title = label;
      button.setAttribute("aria-label", label);
      button.addEventListener("click", () => display(current + step));
      controls.append(button);
    }
    lightbox.append(controls);
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        display(current + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });
  }
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      const rect = lightbox.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) lightbox.close();
    }
  });
  lightbox.addEventListener("close", () => trigger?.focus());
}

document.querySelectorAll("[data-archive-gallery]").forEach((gallery) => {
  const figures = [...gallery.children];
  if (figures.length <= 6) return;
  let shown = 6;
  const button = document.createElement("button");
  button.className = "gallery-more";
  button.type = "button";
  const render = () => {
    figures.forEach((figure, i) => { figure.hidden = i >= shown; });
    button.textContent = `Show more (${Math.max(0, figures.length - shown)} remaining)`;
    button.hidden = shown >= figures.length;
  };
  button.addEventListener("click", () => { shown += 12; render(); });
  gallery.after(button);
  render();
});

const projectSearch = document.querySelector("#project-search");
const projectCategory = document.querySelector("#project-category");
if (projectSearch && projectCategory) {
  document.querySelector(".project-filters").hidden = false;
  const cards = [...document.querySelectorAll("[data-project-card]")];
  const searchIndex = new Map(cards.map((card) => [card, card.dataset.search + " " + (window.portfolioI18n?.searchText(card) || card.textContent)]));
  const filterProjects = () => {
    const normalizeSearch = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const words = normalizeSearch(projectSearch.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach((card) => {
      const searchable = normalizeSearch(searchIndex.get(card));
      const matches = (!projectCategory.value || card.dataset.category === projectCategory.value) && words.every((word) => searchable.includes(word));
      card.hidden = !matches;
      if (matches) count++;
    });
    document.querySelector("#project-count").textContent = `${count} of ${cards.length} projects and studies`;
    document.querySelector("#no-projects").hidden = count !== 0;
  };
  projectSearch.addEventListener("input", filterProjects);
  projectCategory.addEventListener("change", filterProjects);
  document.addEventListener("portfolio:language", filterProjects);
  filterProjects();
}

const parkingBoard = document.querySelector("#parking-board");
if (parkingBoard) {
  const initial = [true, false, true, false, true, true, false, true, false, true, true, false, true, false, false, true];
  let occupied = [...initial];
  const bays = [];
  const render = () => {
    occupied.forEach((busy, index) => {
      bays[index].setAttribute("aria-pressed", String(busy));
      bays[index].setAttribute("aria-label", `Level ${Math.floor(index / 4) + 1}, space ${index % 4 + 1}: ${busy ? "occupied" : "available"}`);
      bays[index].textContent = busy ? "P" : "+";
    });
    const first = occupied.indexOf(false);
    document.querySelector("#parking-count").textContent = `${occupied.filter((busy) => !busy).length} / 16 available`;
    document.querySelector("#parking-next").textContent = first < 0 ? "Full" : `L${Math.floor(first / 4) + 1} / P${first % 4 + 1}`;
  };
  parkingBoard.append(document.createElement("span"));
  for (let i = 1; i <= 4; i++) {
    const label = document.createElement("span");
    label.textContent = `P${i}`;
    parkingBoard.append(label);
  }
  for (let level = 0; level < 4; level++) {
    const label = document.createElement("span");
    label.textContent = `L${level + 1}`;
    parkingBoard.append(label);
    for (let place = 0; place < 4; place++) {
      const index = level * 4 + place;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "parking-bay";
      button.title = `Toggle level ${level + 1}, space ${place + 1}`;
      button.addEventListener("click", () => { occupied[index] = !occupied[index]; render(); });
      bays.push(button);
      parkingBoard.append(button);
    }
  }
  document.querySelectorAll("[data-parking-action]").forEach((button) => button.addEventListener("click", () => {
    occupied = button.dataset.parkingAction === "reset" ? [...initial] : Array(16).fill(button.dataset.parkingAction === "fill");
    render();
  }));
  render();
}

document.querySelectorAll("[data-figure-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    const image = document.querySelector("#response-figure");
    const link = image.closest("a");
    image.src = button.dataset.figureChoice;
    image.alt = button.dataset.caption;
    link.href = button.dataset.figureChoice;
    link.dataset.caption = button.dataset.caption;
    document.querySelector("#response-caption").textContent = button.dataset.caption;
    document.querySelectorAll("[data-figure-choice]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  });
});

const markerPixels = document.querySelector("#marker-pixels");
const objectPixels = document.querySelector("#object-pixels");
if (markerPixels && objectPixels) {
  const updateScale = () => {
    const valid = markerPixels.value !== "" && objectPixels.value !== "" && markerPixels.checkValidity() && objectPixels.checkValidity();
    const format = new Intl.NumberFormat(window.portfolioI18n?.language === "fr" ? "fr-CA" : "en-CA", {minimumFractionDigits:2, maximumFractionDigits:2});
    document.querySelector("#scale-result").textContent = valid ? `${format.format(Number(objectPixels.value) * 5 / Number(markerPixels.value))} cm` : "Enter positive pixel lengths";
  };
  markerPixels.addEventListener("input", updateScale);
  objectPixels.addEventListener("input", updateScale);
  document.addEventListener("portfolio:language", updateScale);
  updateScale();
}
