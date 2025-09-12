// ============================
// CONFIG
// ============================
// Use a URL primária do seu serviço no Render
const API_URL = "https://lkz-store-backend.onrender.com"; 

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
  skinsGrid.innerHTML = ""; // Limpa o grid antes de renderizar

  if (!list.length) {
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

  const mobileView = isMobile();

  list.forEach((skin) => {
    const card = document.createElement("div");
    // Adiciona a classe da categoria para futuras manipulações com filtros
    card.className = `skin-card bg-gray-800 rounded-xl overflow-hidden shadow-md transition flex flex-col ${skin.category}`;

    let floatColor = "text-white";
    const floatValue = parseFloat(skin.floatValue);
    if (!isNaN(floatValue)) {
      if (floatValue <= 0.07) floatColor = "text-blue-400";
      else if (floatValue <= 0.15) floatColor = "text-purple-400";
      else if (floatValue <= 0.38) floatColor = "text-yellow-500";
      else if (floatValue <= 0.45) floatColor = "text-orange-500";
      else floatColor = "text-red-500";
    }

    // Usa skin.imageUrl que é retornado pela API
    const imageSrc = skin.imageUrl || skin.image || ""; 

    card.innerHTML = `
      <div class="skin-card-header">
        <div class="skin-card-name">${skin.name}</div>
        <div class="skin-card-condition">${skin.condition || ""}</div>
      </div>
      <div class="skin-card-body flex flex-col items-center p-4 relative">
        <img src="${imageSrc}" alt="${skin.name}" class="w-32 h-32 object-contain">
        ${skin.sold ? `<div class="ribbon-vendido">VENDIDO</div>` : ""}
        ${!isNaN(floatValue)
          ? `<span class="text-sm ${floatColor} mt-2 font-mono">Float: ${floatValue.toFixed(3)}</span>`
          : '<div class="h-5 mt-2"></div>' // Espaço reservado para manter o layout
        }
      </div>
      <div class="skin-card-footer">
        <div class="flex gap-2 w-full justify-center">
          ${skin.inspectLink ? `<a href="${skin.inspectLink}" class="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa fa-eye text-xs"></i> ${mobileView ? "" : '<span class="hidden sm:inline text-xs">Inspecionar</span>'}</a>` : ""}
          ${skin.csfloatLink ? `<a href="${skin.csfloatLink}" class="bg-indigo-500 hover:bg-indigo-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa fa-external-link text-xs"></i> ${mobileView ? "" : '<span class="hidden sm:inline text-xs">CSFloat</span>'}</a>` : ""}
          ${skin.whatsapp ? `<a href="${skin.whatsapp}" class="bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa-brands fa-whatsapp text-xs"></i> ${mobileView ? "" : '<span class="hidden sm:inline text-xs">WhatsApp</span>'}</a>` : ""}
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
    // Certifique-se de que a URL da API está correta e acessível
    const res = await fetch(`${API_URL}/skins`);
    if (!res.ok) {
      // Verifica o status da resposta para identificar o erro 404
      if (res.status === 404) {
        throw new Error(`Endpoint de skins não encontrado (404). Verifique a URL da API: ${API_URL}`);
      }
      throw new Error(`Erro ao buscar skins (${res.status})`);
    }
    allSkins = await res.json();
    applyFiltersAndSearch(); // Aplica filtros e busca após carregar as skins
  } catch (err) {
    console.error("Erro ao buscar skins:", err);
    // Mostra uma mensagem de erro mais informativa para o usuário
    skinsGrid.innerHTML = `<div class="col-span-full text-center text-red-400 mt-10">${err.message}. Por favor, verifique a conexão ou tente mais tarde.</div>`;
  }
}

// ============================
// FILTRO + BUSCA
// ============================
let currentCategory = "all";
let currentSearch = "";

function applyFiltersAndSearch() {
  let filtered = allSkins;

  // Filtro por categoria
  if (currentCategory !== "all") {
    // Compara a categoria da skin (em minúsculas) com a categoria atual
    filtered = filtered.filter(s => (s.category || "").toLowerCase() === currentCategory.toLowerCase());
  }

  // Filtro por busca de nome
  if (currentSearch) {
    filtered = filtered.filter(s => (s.name || "").toLowerCase().includes(currentSearch.toLowerCase()));
  }

  renderSkins(filtered); // Renderiza as skins filtradas
}

// ============================
// EVENTOS DE FILTRO
// ============================
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove classes de todos os botões para resetar o estilo
    categoryButtons.forEach((b) => b.classList.remove("active", "bg-blue-500"));
    // Adiciona classes ao botão clicado
    btn.classList.add("active", "bg-blue-500");
    // Atualiza a categoria atual
    currentCategory = btn.getAttribute("data-filter") || "all";
    applyFiltersAndSearch(); // Aplica os filtros
  });
});

// ============================
// EVENTO DE BUSCA
// ============================
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value || ""; // Pega o valor do input, ou string vazia se for nulo/undefined
  applyFiltersAndSearch(); // Aplica os filtros (incluindo a busca)
});

// ============================
// INICIALIZAÇÃO
// ============================
document.addEventListener("DOMContentLoaded", () => {
  fetchSkins(); // Carrega as skins quando a página é totalmente carregada
  // Adiciona um listener para redimensionamento da janela para otimizar a exibição em mobile/desktop
  window.addEventListener("resize", () => applyFiltersAndSearch()); 
});


