// ============================
// CONFIG
// ============================
const API_URL = "https://lkz-store-backend.onrender.com/";

// ============================
// ELEMENTOS DOM
// ============================
const skinsGrid = document.getElementById("skins-grid");
const searchInput = document.getElementById("search");
const categoryButtons = document.querySelectorAll("nav button[data-filter]");

// Botão e modal de marcar como vendida
const markSoldBtn = document.createElement("button");
markSoldBtn.textContent = "Marcar Skin como Vendida";
markSoldBtn.className =
  "fixed top-24 right-8 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded shadow-lg z-50";
document.body.appendChild(markSoldBtn);

const soldModal = document.createElement("div");
soldModal.id = "sold-modal";
soldModal.className = "fixed inset-0 bg-black/60 flex items-center justify-center hidden z-50";
soldModal.innerHTML = `
  <div class="bg-gray-800 p-6 rounded-xl max-w-lg w-full shadow-lg">
    <div id="sold-skins-list" class="flex flex-col gap-2 max-h-96 overflow-y-auto mb-4"></div>
    <button id="confirm-sold" class="w-full bg-green-500 hover:bg-green-400 py-2 rounded mb-2">Marcar como Vendida</button>
    <button id="close-sold" class="w-full bg-red-500 hover:bg-red-400 py-2 rounded">Fechar</button>
  </div>
`;
document.body.appendChild(soldModal);

const soldSkinsList = document.getElementById("sold-skins-list");
const confirmSoldBtn = document.getElementById("confirm-sold");
const closeSoldBtn = document.getElementById("close-sold");

// ============================
// FUNÇÃO PARA VERIFICAR SE É MOBILE
// ============================
function isMobile() {
  return window.innerWidth <= 768;
}

// ============================
// FUNÇÃO DE RENDER
// ============================
function renderSkins(list) {
  skinsGrid.innerHTML = "";

  if (list.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className =
      "col-span-full text-center text-gray-400 text-lg mt-10 flex flex-col items-center justify-center";
    emptyMessage.innerHTML = `
      <span>
        Não temos skins nessa sessão ainda! 
        <img src="imagens/galinha.png" alt="CS2" class="inline w-6 h-6 ml-1 align-text-bottom">
      </span>
      <span class="mt-2 text-sm text-gray-500">Volte mais tarde para novidades</span>
    `;
    skinsGrid.appendChild(emptyMessage);
    return;
  }

  list.forEach((skin) => {
    const card = document.createElement("div");
    card.className = `skin-card bg-gray-800 rounded-xl overflow-hidden shadow-md transition flex flex-col ${skin.category}`;

    let floatColor = "text-white";
    if (skin.floatValue !== undefined) {
      if (skin.floatValue <= 0.07) floatColor = "text-blue-400";
      else if (skin.floatValue <= 0.15) floatColor = "text-purple-400";
      else if (skin.floatValue <= 0.38) floatColor = "text-yellow-500";
      else if (skin.floatValue <= 0.45) floatColor = "text-orange-500";
      else floatColor = "text-red-500";
    }

    const isMobileView = isMobile();

    card.innerHTML = `
      <div class="skin-card-header">
        <div class="skin-card-name">${skin.name}</div>
        <div class="skin-card-condition">${skin.condition || ""}</div>
      </div>
      <div class="skin-card-body flex flex-col items-center p-4 relative">
        <img src="${skin.imageUrl}" alt="${skin.name}" class="w-32 h-32 object-contain">
        ${skin.sold ? `<div class="ribbon-vendido">VENDIDO</div>` : ""}
        ${skin.floatValue !== undefined
          ? `<span class="text-sm ${floatColor} mt-2 font-mono">Float: ${skin.floatValue.toFixed(3)}</span>`
          : '<div class="h-5 mt-2"></div>'
        }
      </div>
      <div class="skin-card-footer">
        <div class="flex gap-2 w-full justify-center">
          ${skin.inspectLink ? `<a href="${skin.inspectLink}" class="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa fa-eye text-xs"></i> ${isMobileView ? "" : '<span class="hidden sm:inline text-xs">Inspecionar</span>'}</a>` : ""}
          ${skin.csfloatLink ? `<a href="${skin.csfloatLink}" class="bg-indigo-500 hover:bg-indigo-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa fa-external-link text-xs"></i> ${isMobileView ? "" : '<span class="hidden sm:inline text-xs">CSFloat</span>'}</a>` : ""}
          ${skin.whatsappLink ? `<a href="${skin.whatsappLink}" class="bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa-brands fa-whatsapp text-xs"></i> ${isMobileView ? "" : '<span class="hidden sm:inline text-xs">WhatsApp</span>'}</a>` : ""}
        </div>
      </div>
    `;
    skinsGrid.appendChild(card);
  });
}

// ============================
// MODAL MARCAR VENDIDA
// ============================
function openSoldModal() {
  soldSkinsList.innerHTML = "";
  allSkins.forEach((skin) => {
    const item = document.createElement("div");
    item.className = "flex items-center justify-between p-2 bg-gray-700 rounded";
    item.innerHTML = `
      <label class="flex items-center gap-2">
        <input type="checkbox" value="${skin.id}" ${skin.sold ? "checked disabled" : ""}>
        <span>${skin.name} (${skin.condition})</span>
      </label>
    `;
    soldSkinsList.appendChild(item);
  });
  soldModal.classList.remove("hidden");
}

markSoldBtn.addEventListener("click", openSoldModal);
closeSoldBtn.addEventListener("click", () => soldModal.classList.add("hidden"));

// Confirmar venda
confirmSoldBtn.addEventListener("click", async () => {
  const selected = [...soldSkinsList.querySelectorAll("input[type=checkbox]:not(:disabled):checked")].map(input => input.value);
  if (!selected.length) return alert("Selecione ao menos uma skin.");

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/skins/mark-sold`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids: selected }),
    });
    if (!res.ok) throw new Error("Erro ao marcar skins como vendida");
    soldModal.classList.add("hidden");
    await fetchSkins(); // Recarrega as skins
  } catch (err) {
    alert(err.message);
  }
});

// ============================
// FETCH DAS SKINS DA API
// ============================
let allSkins = [];

async function fetchSkins() {
  try {
    const res = await fetch(`${API_URL}/skins`);
    allSkins = await res.json();
    renderSkins(allSkins);
  } catch (err) {
    console.error("Erro ao buscar skins:", err);
  }
}

// ============================
// FILTRO POR CATEGORIA
// ============================
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => {
      b.classList.remove("active", "bg-blue-500");
      b.classList.add("bg-gray-700");
    });
    btn.classList.add("active", "bg-blue-500");
    btn.classList.remove("bg-gray-700");

    const filter = btn.getAttribute("data-filter");
    let filtered = allSkins;
    if (filter !== "all") filtered = allSkins.filter((s) => s.category === filter);

    renderSkins(filtered);
  });
});

// ============================
// BUSCA POR NOME
// ============================
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allSkins.filter((s) => s.name.toLowerCase().includes(query));
  renderSkins(filtered);
});

// ============================
// INICIALIZAÇÃO
// ============================
document.addEventListener("DOMContentLoaded", () => {
  fetchSkins();
  window.addEventListener("resize", () => renderSkins(allSkins));
});
