const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

const scanBtn = document.getElementById("scanBtn");
const output = document.getElementById("output");
const titleInput = document.getElementById("titleInput");
const status = document.getElementById("status");

const saveBtn = document.getElementById("saveBtn");

const searchInput = document.getElementById("searchInput");
const list = document.getElementById("list");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

let selectedImage = null;
let data = JSON.parse(localStorage.getItem("ocr_db") || "[]");
let editingId = null;


// ==========================
// IMAGE + PASTE
// ==========================
imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) setImage(file);
});

document.addEventListener("paste", e => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (let item of items) {
    if (item.type.includes("image")) {
      setImage(item.getAsFile());
    }
  }
});

function setImage(file) {
  selectedImage = file;
  const r = new FileReader();
  r.onload = () => preview.src = r.result;
  r.readAsDataURL(file);
}


// ==========================
// OCR SIMPLE & STABLE
// ==========================
scanBtn.onclick = async () => {
  if (!selectedImage) return alert("NO IMAGE");

  status.textContent = "SCANNING...";

  const res = await Tesseract.recognize(selectedImage, "fra+eng");

  let text = res.data.text || "";

  // =========================
  // OCR CLEAN INTELLIGENT
  // =========================
  text = text
    .split("\n")
    .map(l => l.trim())

    // suppression icônes début ligne (IMPORTANT)
    .map(l =>
      l.replace(/^(\d+)?\s*[»›>@&§•\-–—_|=]+/g, "")
    )

    // suppression icônes isolées
    .map(l =>
      l.replace(/^[^A-Za-zÀ-ÿ0-9]+/, "")
    )

    // suppression lignes vides
    .filter(l => l.length > 0)

    .join("\n");

  output.value = text;

  // =========================
  // TITRE (inchangé mais stable)
  // =========================
  const lines = text.split("\n");
  titleInput.value = lines[0] || "NODE";

  status.textContent = "DONE ✔";
};


// ==========================
// SAVE
// ==========================
saveBtn.onclick = () => {
  const title = titleInput.value || "NODE";

  if (editingId) {
    const i = data.findIndex(d => d.id === editingId);
    data[i].title = title;
    data[i].text = output.value;
    editingId = null;
  } else {
    data.unshift({
      id: Date.now(),
      title,
      text: output.value
    });
  }

  localStorage.setItem("ocr_db", JSON.stringify(data));
  render();

  // =========================
  // CLEAN TEXT
  // =========================
  output.value = "";
  titleInput.value = "";
  editingId = null;

  // =========================
  // CLEAN IMAGE PREVIEW 🔥 NEW
  // =========================
  selectedImage = null;
  preview.src = "";

  // reset input file (important pour re-upload même fichier)
  imageInput.value = "";

  // =========================
  // STATUS FEEDBACK
  // =========================
  status.textContent = "SAVED ✔";

  setTimeout(() => {
    status.textContent = "";
  }, 1200);
};


// ==========================
// RENDER SIMPLE CARDS
// ==========================
function render(filter = "") {
  list.innerHTML = "";

  data
    .filter(d =>
      d.title.toLowerCase().includes(filter.toLowerCase()) ||
      d.text.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(d => {

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <div class="card-title">${d.title}</div>
        <div style="white-space: pre-wrap;">${d.text.slice(0, 250)}</div>

        <div class="card-actions">
          <button onclick="copy(${d.id})">COPY</button>
          <button onclick="edit(${d.id})">EDIT</button>
          <button onclick="del(${d.id})">DEL</button>
        </div>
      `;

      list.appendChild(div);
    });
}


// ==========================
// CRUD COPY / EDIT / DEL
// ==========================
window.copy = id => {
  const d = data.find(x => x.id === id);
  navigator.clipboard.writeText(d.text);
};

window.edit = id => {
  const d = data.find(x => x.id === id);

  editingId = id;
  titleInput.value = d.title;
  output.value = d.text;

  // 🔥 scroll automatique vers zone d'édition
  output.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  // option bonus : focus direct
  setTimeout(() => {
    output.focus();
  }, 300);
};

window.del = id => {

  const d = data.find(x => x.id === id);
  if (!d) return;

  const confirmDelete = confirm(`Delete this entry ?\n\n"${d.title}"`);

  if (!confirmDelete) return;

  data = data.filter(x => x.id !== id);
  localStorage.setItem("ocr_db", JSON.stringify(data));

  render();
};


// ==========================
// SEARCH
// ==========================
searchInput.addEventListener("input", e => render(e.target.value));


// ==========================
// EXPORT / IMPORT
// ==========================
exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ocr.json";
  a.click();
};

importBtn.onclick = () => importFile.click();

importFile.onchange = e => {
  const reader = new FileReader();
  reader.onload = () => {
    data = JSON.parse(reader.result);
    localStorage.setItem("ocr_db", JSON.stringify(data));
    render();
  };
  reader.readAsText(e.target.files[0]);
};


// INIT
render();