const STORAGE_KEY = "moving-sale-overrides-v1";
const SELLER_KEY = "moving-sale-seller";
const CONDITIONS = ["Like new", "Good", "Fair", "Used", "For parts"];

const ICONS = {
  bed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18V8M3 14h18v4M21 18V11a2 2 0 0 0-2-2H9M7 9V7a2 2 0 0 1 2-2h2"/></svg>`,
  washer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M8 6h.01M11 6h3"/></svg>`,
  fridge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 10h12M9 6v2M9 14v3"/></svg>`,
  chair: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 10V5h10v5M6 10h12v4H6zM8 14v5M16 14v5"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>`,
  power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v8"/><path d="M7 7a7 7 0 1 0 10 0"/><rect x="5" y="18" width="14" height="3" rx="1"/></svg>`,
  kitchen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 10h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M8 10V6h8v4M12 14v2"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="12" cy="15" rx="8" ry="5"/><path d="M8 14c.5-4 2-7 4-7s3.5 3 4 7"/></svg>`,
  sofa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M3 12h18v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM7 19v2M17 19v2"/></svg>`,
  desk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9h18M5 9v10M19 9v10M9 9v5h6"/></svg>`,
  bike: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="16" r="3"/><circle cx="17" cy="16" r="3"/><path d="M7 16l4-7h4l2 7M11 9l-2 4h6"/></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M3 8v8l9 4 9-4V8M12 12v8"/></svg>`,
};

const TINT = {
  bed: "#f0e0d4",
  washer: "#e3ebe6",
  fridge: "#e4eaf2",
  chair: "#efe6d4",
  tv: "#e7e4ef",
  monitor: "#e6eaf0",
  power: "#f3e6c8",
  kitchen: "#f6e4d8",
  bag: "#efe0ea",
  sofa: "#e9e3d8",
  desk: "#e7eee4",
  bike: "#e4eee8",
  box: "#efe6da",
};

const KIND = {
  "king-bed": "bed",
  "samsung-washer-7kg": "washer",
  "samsung-fridge-236": "fridge",
  "patio-set": "chair",
  "samsung-tv-43": "tv",
  "samsung-monitor-24": "monitor",
  "hp-monitor-22": "monitor",
  "luminous-inverter": "power",
  "philips-airfryer": "kitchen",
  "bean-bag-xxxl": "bag",
  "sofa-cum-bed": "sofa",
  "study-table": "desk",
  "cultfit-bike": "bike",
};

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const listEl = document.querySelector("#list");
const statsEl = document.querySelector("#stats");
const errorEl = document.querySelector("#error");
const searchEl = document.querySelector("#search");
const sellerEl = document.querySelector("#seller-mode");
const publishEl = document.querySelector("#publish");
const publishText = document.querySelector("#publish-text");
const dialog = document.querySelector("#lightbox");
const lightboxFrame = document.querySelector("#lightbox-frame");
const lightboxCaption = document.querySelector("#lightbox-caption");
const prevBtn = document.querySelector("#lightbox-prev");
const nextBtn = document.querySelector("#lightbox-next");

let catalog = { title: "Moving sale", contact: "", items: [] };
let overrides = loadOverrides();
let filter = "all";
let lightbox = { id: null, index: 0 };

sellerEl.checked = localStorage.getItem(SELLER_KEY) === "1" || location.hash === "#edit";

function loadOverrides() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveOverrides() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeSrc(src) {
  const value = String(src || "").trim();
  if (value.startsWith("images/") || value.startsWith("./images/")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return "";
}

function kindOf(item) {
  return KIND[item.id] || "box";
}

function iconFor(item) {
  return ICONS[kindOf(item)] || ICONS.box;
}

function same(a, b) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function mergedItems() {
  return catalog.items.map((base, order) => {
    const patch = overrides[base.id] || {};
    const item = {
      ...base,
      ...patch,
      id: base.id,
      order,
      images: Array.isArray(patch.images) ? patch.images : base.images || [],
    };
    item.images = item.images.map(safeSrc).filter(Boolean);
    item.sold = Boolean(item.sold);
    item.mrp = Number(item.mrp) || 0;
    item.price = Number(item.price) || 0;
    return item;
  });
}

function visibleItems() {
  const query = searchEl.value.trim().toLowerCase();
  return mergedItems()
    .filter((item) => {
      if (filter === "available" && item.sold) return false;
      if (filter === "sold" && !item.sold) return false;
      if (!query) return true;
      return `${item.name} ${item.condition} ${item.note}`.toLowerCase().includes(query);
    })
    .sort((a, b) => Number(a.sold) - Number(b.sold) || a.order - b.order);
}

function setOverride(id, patch, renderNow = true) {
  const base = catalog.items.find((item) => item.id === id);
  if (!base) return;
  const next = { ...(overrides[id] || {}), ...patch };
  for (const key of Object.keys(next)) {
    if (same(next[key], base[key])) delete next[key];
  }
  if (Object.keys(next).length === 0) delete overrides[id];
  else overrides[id] = next;
  saveOverrides();
  if (renderNow) render();
}

function money(amount) {
  return rupee.format(amount);
}

function offPercent(item) {
  if (item.mrp <= item.price || item.mrp <= 0) return 0;
  return Math.round((1 - item.price / item.mrp) * 100);
}

function conditionOptions(current) {
  const values = CONDITIONS.includes(current) ? CONDITIONS : [current, ...CONDITIONS];
  return values
    .filter(Boolean)
    .map((value) => `<option${value === current ? " selected" : ""}>${esc(value)}</option>`)
    .join("");
}

function photoMarkup(item) {
  const src = item.images[0];
  const img = src
    ? `<img src="${esc(src)}" alt="" onerror="this.remove()">`
    : "";
  const count =
    item.images.length > 1 ? `<span class="count">${item.images.length} photos</span>` : "";
  const stamp = item.sold ? `<span class="stamp">Sold</span>` : "";
  return `
    <button class="photo-btn" type="button" data-open="${esc(item.id)}" aria-label="Open photos of ${esc(item.name)}">
      <span class="frame" style="--tint:${TINT[kindOf(item)] || TINT.box}">
        <span class="fallback">${iconFor(item)}<span>Photo</span></span>
        ${img}
        ${stamp}
        ${count}
      </span>
    </button>`;
}

function editorMarkup(item) {
  if (!sellerEl.checked) return "";
  return `
    <div class="edit">
      <label>Name
        <input data-id="${esc(item.id)}" data-field="name" value="${esc(item.name)}" />
      </label>
      <label>Condition
        <select data-id="${esc(item.id)}" data-field="condition">${conditionOptions(item.condition)}</select>
      </label>
      <div class="pair">
        <label>MRP
          <input data-id="${esc(item.id)}" data-field="mrp" type="number" min="0" step="1" value="${item.mrp}" />
        </label>
        <label>Selling price
          <input data-id="${esc(item.id)}" data-field="price" type="number" min="0" step="1" value="${item.price}" />
        </label>
      </div>
      <label>Photos, one path per line
        <textarea data-id="${esc(item.id)}" data-field="images" placeholder="images/${esc(item.id)}.jpg">${esc(item.images.join("\n"))}</textarea>
      </label>
      <label>Note
        <input data-id="${esc(item.id)}" data-field="note" value="${esc(item.note || "")}" placeholder="Optional detail" />
      </label>
    </div>`;
}

function cardMarkup(item) {
  const off = offPercent(item);
  const mrp = item.mrp > item.price ? `<span class="mrp">${money(item.mrp)}</span>` : "";
  const offTag = off ? `<span class="off">${off}% off</span>` : "";
  const note = item.note ? `<p class="note">${esc(item.note)}</p>` : "";
  const soldLabel = item.sold ? "Mark available" : "Mark sold";
  const sellerButtons = sellerEl.checked
    ? `<button class="mark" type="button" data-sold="${esc(item.id)}">${soldLabel}</button>`
    : "";
  return `
    <article class="card${item.sold ? " sold" : ""}">
      ${photoMarkup(item)}
      <div class="body">
        <div class="name-row">
          <h3>${esc(item.name)}</h3>
          ${item.condition ? `<span class="pill">${esc(item.condition)}</span>` : ""}
        </div>
        <div class="prices">
          <span class="price">${money(item.price)}</span>
          ${mrp}
          ${offTag}
        </div>
        ${note}
        ${sellerButtons}
        ${editorMarkup(item)}
      </div>
    </article>`;
}

function sectionMarkup(title, items) {
  if (!items.length) return "";
  return `
    <section class="section">
      <h2>${title} <span>${items.length}</span></h2>
      <div class="grid">${items.map(cardMarkup).join("")}</div>
    </section>`;
}

function render() {
  const items = visibleItems();
  const all = mergedItems();
  const availableCount = all.filter((item) => !item.sold).length;
  const soldCount = all.length - availableCount;
  statsEl.innerHTML = `<strong>${availableCount}</strong> available · <strong>${soldCount}</strong> sold`;

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });

  if (!catalog.items.length) {
    listEl.innerHTML = "";
    return;
  }

  const available = items.filter((item) => !item.sold);
  const sold = items.filter((item) => item.sold);
  const html = `${sectionMarkup("Available", available)}${sectionMarkup("Sold", sold)}`;
  listEl.innerHTML = html || `<p class="empty">Nothing matches that search.</p>`;

  const pending = Object.keys(overrides).length;
  publishEl.hidden = pending === 0;
  document.body.classList.toggle("has-edits", pending > 0);
  publishText.textContent = pending
    ? `${pending} item${pending === 1 ? "" : "s"} changed in this browser. Download the file, replace inventory.json, and push so everyone sees it.`
    : "";

  if (dialog.open) paintLightbox();
}

function parseImages(value) {
  return value
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function readField(el) {
  const id = el.dataset.id;
  const field = el.dataset.field;
  if (!id || !field) return null;
  if (field === "name") {
    const name = el.value.trim();
    if (!name) return null;
    return { id, patch: { name } };
  }
  if (field === "mrp" || field === "price") {
    const amount = Number(el.value);
    if (!Number.isFinite(amount) || amount < 0) return null;
    return { id, patch: { [field]: amount } };
  }
  if (field === "images") return { id, patch: { images: parseImages(el.value) } };
  if (field === "condition") return { id, patch: { condition: el.value } };
  if (field === "note") return { id, patch: { note: el.value.trim() } };
  return null;
}

function itemById(id) {
  return mergedItems().find((item) => item.id === id);
}

function paintLightbox() {
  const item = itemById(lightbox.id);
  if (!item) {
    dialog.close();
    return;
  }
  const images = item.images;
  const hasMany = images.length > 1;
  prevBtn.hidden = !hasMany;
  nextBtn.hidden = !hasMany;
  if (images.length) {
    lightbox.index = (lightbox.index + images.length) % images.length;
    lightboxFrame.innerHTML = `<img src="${esc(images[lightbox.index])}" alt="${esc(item.name)}">`;
  } else {
    lightboxFrame.innerHTML = `<div class="lightbox-fallback">${iconFor(item)}<p>No photo yet. Add one under images/ while updating the inventory.</p></div>`;
  }
  const page = images.length ? `${lightbox.index + 1} / ${images.length}` : "No photo";
  lightboxCaption.innerHTML = `<strong>${esc(item.name)}</strong><span>${esc(item.condition || "")} · ${money(item.price)} · ${page}</span>`;
}

function openLightbox(id) {
  lightbox = { id, index: 0 };
  paintLightbox();
  if (!dialog.open) dialog.showModal();
}

function exportInventory() {
  const items = mergedItems().map((item) => ({
    id: item.id,
    name: item.name,
    mrp: item.mrp,
    price: item.price,
    condition: item.condition || "Used",
    sold: item.sold,
    images: item.images,
    note: item.note || "",
  }));
  const file = {
    title: catalog.title || "Moving sale",
    contact: catalog.contact || "",
    items,
  };
  const blob = new Blob([`${JSON.stringify(file, null, 2)}\n`], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "inventory.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

listEl.addEventListener("click", (event) => {
  const soldBtn = event.target.closest("[data-sold]");
  if (soldBtn) {
    const item = itemById(soldBtn.dataset.sold);
    if (item) setOverride(item.id, { sold: !item.sold });
    return;
  }
  const photo = event.target.closest("[data-open]");
  if (photo) openLightbox(photo.dataset.open);
});

listEl.addEventListener("input", (event) => {
  const change = readField(event.target);
  if (change) setOverride(change.id, change.patch, false);
});

listEl.addEventListener("change", (event) => {
  const change = readField(event.target);
  if (change) setOverride(change.id, change.patch, true);
});

document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  filter = button.dataset.filter;
  render();
});

searchEl.addEventListener("input", () => render());

sellerEl.addEventListener("change", () => {
  localStorage.setItem(SELLER_KEY, sellerEl.checked ? "1" : "0");
  const url = new URL(location.href);
  if (sellerEl.checked) url.hash = "edit";
  else url.hash = "";
  history.replaceState(null, "", url);
  render();
});

document.querySelector("#download").addEventListener("click", exportInventory);
document.querySelector("#reset").addEventListener("click", () => {
  overrides = {};
  saveOverrides();
  render();
});

document.querySelector("#lightbox-close").addEventListener("click", () => dialog.close());
prevBtn.addEventListener("click", () => {
  lightbox.index -= 1;
  paintLightbox();
});
nextBtn.addEventListener("click", () => {
  lightbox.index += 1;
  paintLightbox();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  dialog.close();
});

document.addEventListener("keydown", (event) => {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") {
    lightbox.index -= 1;
    paintLightbox();
  } else if (event.key === "ArrowRight") {
    lightbox.index += 1;
    paintLightbox();
  }
});

async function init() {
  try {
    const response = await fetch("inventory.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load inventory (${response.status})`);
    const data = await response.json();
    catalog = {
      title: data.title || "Moving sale",
      contact: data.contact || "",
      items: Array.isArray(data.items) ? data.items : [],
    };
    document.querySelector("#title").textContent = catalog.title;
    document.title = catalog.title;
    const contact = document.querySelector("#contact");
    if (catalog.contact) {
      contact.hidden = false;
      contact.textContent = catalog.contact;
    }
    errorEl.hidden = true;
    render();
  } catch (error) {
    errorEl.hidden = false;
    errorEl.textContent = `${error.message}. Open this page through a local server or GitHub Pages, not as a bare file.`;
  }
}

init();
