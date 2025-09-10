// ============================
// CONFIG
// ============================
const API_URL = "https://lkz-store-backend.onrender.com/"; // URL da API

// ============================
// ELEMENTOS DOM
// ============================
const skinsGrid = document.getElementById("skins-grid");
const searchInput = document.getElementById("search");
const categoryButtons = document.querySelectorAll("nav button[data-filter]");

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
    card.className = `skin-card bg-gray-800 rounded-xl overflow-hidden shadow-md transition flex flex-col ${skin.categoria}`;

    // Cor do float
    let floatColor = "text-white-500";
    if (skin.float !== undefined) {
      if (skin.float <= 0.07) floatColor = "text-blue-400";
      else if (skin.float <= 0.15) floatColor = "text-purple-400";
      else if (skin.float <= 0.38) floatColor = "text-yellow-500";
      else if (skin.float <= 0.45) floatColor = "text-orange-500";
      else floatColor = "text-red-500";
    }

    const isMobileView = isMobile();

    card.innerHTML = `
      <div class="skin-card-header">
        <div class="skin-card-name">${skin.nome}</</div>
        <div class="skin-card-condition">${skin.condicao || ""}</div>
      </div>
      
      <div class="skin-card-body flex flex-col items-center p-4 relative">
        <img src="${skin.imagem}" alt="${skin.nome}" class="w-32 h-32 object-contain">

        ${skin.vendido ? `<div class="ribbon-vendido">VENDIDO</div>` : ""}

        ${
          skin.float !== undefined
            ? `<span class="text-sm ${floatColor} mt-2 font-mono">Float: ${skin.float.toFixed(
                3
              )}</span>`
            : '<div class="h-5 mt-2"></div>'
        }
      </div>

      <div class="skin-card-footer">
        <div class="flex gap-2 w-full justify-center">
          ${
            skin.inspectLink
              ? `<a href="${skin.inspectLink}" class="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank">
              <i class="fa fa-eye text-xs"></i> ${
                isMobileView ? "" : '<span class="hidden sm:inline text-xs">Inspecionar</span>'
              }
            </a>`
              : ""
          }
          
          ${
            skin.csfloatLink
              ? `<a href="${skin.csfloatLink}" class="bg-indigo-500 hover:bg-indigo-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank">
              <i class="fa fa-external-link text-xs"></i> ${
                isMobileView ? "" : '<span class="hidden sm:inline text-xs">CSFloat</span>'
              }
            </a>`
              : ""
          }

          ${
            skin.whatsapp
              ? `<a href="${skin.whatsapp}" class="bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank">
              <i class="fa-brands fa-whatsapp text-xs"></i> ${
                isMobileView ? "" : '<span class="hidden sm:inline text-xs">WhatsApp</span>'
              }
            </a>`
              : ""
          }
        </div>
      </div>
    `;

    skinsGrid.appendChild(card);
  });
}

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
    if (filter !== "all") filtered = allSkins.filter((s) => s.categoria === filter);

    renderSkins(filtered);
  });
});

// ============================
// BUSCA POR NOME
// ============================
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allSkins.filter((s) => s.nome.toLowerCase().includes(query));
  renderSkins(filtered);
});

// ============================
// INICIALIZAÇÃO
// ============================
document.addEventListener("DOMContentLoaded", () => {
  fetchSkins();
  window.addEventListener("resize", () => renderSkins(allSkins));
});
