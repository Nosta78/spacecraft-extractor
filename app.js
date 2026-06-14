const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const extractBtn = document.getElementById("extractBtn");
const output = document.getElementById("output");
const status = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const database = document.getElementById("database");
const searchInput = document.getElementById("searchInput");
const titleInput = document.getElementById("titleInput");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

let selectedImage = null;
let currentText = "";
let editingId = null;

let data = JSON.parse(localStorage.getItem("ocr_db") || "[]");


// ==========================
// IMAGE INPUT + PASTE
// ==========================
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  handleImage(file);
});

document.addEventListener("paste", (event) => {
  const items = event.clipboardData.items;

  for (let item of items) {
    if (item.type.includes("image")) {
      handleImage(item.getAsFile());
    }
  }
});

function handleImage(file) {
  selectedImage = file;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
  };
  reader.readAsDataURL(file);
}


// ==========================
// OCR DOUBLE PASS
// ==========================
extractBtn.addEventListener("click", async () => {
  if (!selectedImage) {
    alert("Ajoute ou colle une image !");
    return;
  }

  status.innerText = "Analyse en cours...";

  const result1 = await Tesseract.recognize(selectedImage, "fra+eng", {
    tessedit_pageseg_mode: 11,
    logger: (m) => {
      if (m.status === "recognizing text") {
        status.innerText = `OCR ${Math.round(m.progress * 100)}%`;
      }
    }
  });

  const result2 = await Tesseract.recognize(selectedImage, "fra+eng", {
    tessedit_pageseg_mode: 6
  });

  currentText = cleanFinal(
    mergeResults(result1.data.text, result2.data.text)
  );

  output.value = currentText;
  status.innerText = "OCR terminé ✔";
});


// ==========================
// MERGE OCR
// ==========================
function mergeResults(a, b) {
  const lines = new Set([
    ...a.split("\n").map(l => l.trim()).filter(Boolean),
    ...b.split("\n").map(l => l.trim()).filter(Boolean)
  ]);

  return Array.from(lines).join("\n");
}


// ==========================
// CLEAN FINAL (VERSION ROBUSTE ICONES)
// ==========================
function cleanFinal(text) {
  return text
    .split("\n")
    .map(line => {

      let l = line.trim();

      // 1. supprime icônes type » - • = etc en début de ligne
      l = l.replace(/^[\s]*[»•\-–—=+*#~|]/, "");

      // 2. supprime pattern "2»", "A»", "if,", etc en début de ligne
      l = l.replace(/^[\s]*[0-9A-Za-z]{1,3}[»•\-–—=+*#~|,]*/, "");

      // 3. supprime tokens isolés absurdes en début
      l = l.replace(/^[\s]*(if,?|lt,?|it,?|l,?|e)\s+/i, "");

      return l.trim();
    })

    // 4. supprime lignes vides
    .filter(Boolean)

    // 5. espaces internes
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}


// ==========================
// SAVE / EDIT
// ==========================
saveBtn.addEventListener("click", () => {
  if (!output.value.trim()) return alert("Rien à sauvegarder");

  const title = titleInput.value || `Scan ${new Date().toLocaleString()}`;

  if (editingId !== null) {
    const index = data.findIndex(d => d.id == editingId);

    if (index !== -1) {
      data[index].title = title;
      data[index].text = output.value;
    }

    editingId = null;
    status.innerText = "Modification enregistrée ✔";
  } else {
    data.unshift({
      id: Date.now(),
      title,
      text: output.value
    });

    status.innerText = "Entrée sauvegardée ✔";
  }

  localStorage.setItem("ocr_db", JSON.stringify(data));
  titleInput.value = "";
  render();
});


// ==========================
// EDIT
// ==========================
window.editItem = (id) => {
  const item = data.find(d => d.id == id);
  if (!item) return;

  editingId = id;

  titleInput.value = item.title;
  output.value = item.text;

  status.innerText = "Mode édition activé ✏️";
};


// ==========================
// DELETE
// ==========================
window.deleteItem = (id) => {
  data = data.filter(d => d.id != id);
  localStorage.setItem("ocr_db", JSON.stringify(data));
  render(searchInput.value);
};


// ==========================
// COPY
// ==========================
window.copyText = (id) => {
  const item = data.find(d => d.id == id);
  navigator.clipboard.writeText(item.text);
  alert("Copié !");
};


// ==========================
// SEARCH
// ==========================
searchInput.addEventListener("input", (e) => {
  render(e.target.value);
});


// ==========================
// RENDER
// ==========================
function render(filter = "") {
  database.innerHTML = "";

  const filtered = data.filter(item =>
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    item.text.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="card-title">${item.title}</div>
      <div class="card-text">${item.text.slice(0, 250)}...</div>

      <div class="card-actions">
        <button onclick="copyText('${item.id}')">Copier</button>
        <button onclick="editItem('${item.id}')">Modifier</button>
        <button onclick="deleteItem('${item.id}')">Supprimer</button>
      </div>
    `;

    database.appendChild(div);
  });
}


// ==========================
// EXPORT
// ==========================
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ocr_database.json";
  a.click();

  URL.revokeObjectURL(url);
});


// ==========================
// IMPORT
// ==========================
importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);

      if (!Array.isArray(imported)) {
        alert("Fichier invalide ❌");
        return;
      }

      data = imported;
      localStorage.setItem("ocr_db", JSON.stringify(data));
      render();

      alert("Import réussi ✔");
    } catch (err) {
      alert("Erreur import ❌");
    }
  };

  reader.readAsText(file);
});


// ==========================
// INIT
// ==========================
render();