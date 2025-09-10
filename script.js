// ============================
// CONFIG
// ============================
const API_URL = "https://lkz-store-backend.onrender.com/"; // Verifique se esta URL está correta

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

  if (!list || list.length === 0) { // Verifica se a lista é null, undefined ou vazia
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
    // Adiciona a classe da categoria para possível filtragem CSS/JS adicional
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

    // A imagem deve ser referenciada pela propriedade correta enviada pela API
    // A API agora retorna 'imageUrl', então vamos usá-la. Se a imagem for um path relativo no servidor, o server.js precisa servir a pasta 'uploads'.
    const imageSrc = skin.imageUrl || skin.image || ""; // Usa imageUrl primeiro, depois image

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
          : '<div class="h-5 mt-2"></div>' // Espaço reservado se não houver float
        }
      </div>
      <div class="skin-card-footer">
        <div class="flex gap-2 w-full justify-center">
          ${skin.inspectLink ? `<a href="${skin.inspectLink}" class="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa fa-eye text-xs"></i> ${mobileView ? "" : '<span class="hidden sm:inline text-xs">Inspecionar</span>'}</a>` : ""}
          ${skin.csfloatLink ? `<a href="${skin.csfloatLink}" class="bg-indigo-500 hover:bg-indigo-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa fa-external-link text-xs"></i> ${mobileView ? "" : '<span class="hidden sm:inline text-xs">CSFloat</span>'}</a>` : ""}
          ${skin.whatsappLink ? `<a href="${skin.whatsappLink}" class="bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank"><i class="fa-brands fa-whatsapp text-xs"></i> ${mobileView ? "" : '<span class="hidden sm:inline text-xs">WhatsApp</span>'}</a>` : ""}
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
    if (!res.ok) {
        // Verifica se o erro é de rede ou do servidor
        if (res.status === 404) {
            throw new Error("Servidor de skins não encontrado (404)");
        } else if (res.status === 500) {
            throw new Error("Erro interno no servidor ao buscar skins (500)");
        } else {
            throw new Error(`Erro ao buscar skins (${res.status})`);
        }
    }
    
    allSkins = await res.json();
    // Aplica os filtros e busca apenas após carregar todas as skins
    applyFiltersAndSearch(); 

  } catch (err) {
    console.error("Erro ao buscar skins:", err);
    // Exibe uma mensagem de erro mais amigável no grid
    skinsGrid.innerHTML = `<div class="col-span-full text-center text-red-400 mt-10">Erro ao carregar skins. Por favor, verifique a conexão ou tente mais tarde. (${err.message})</div>`;
  }
}

// ============================
// FILTRO + BUSCA
// ============================
let currentCategory = "all";
let currentSearch = "";

function applyFiltersAndSearch() {
  let filtered = [...allSkins]; // Cria uma cópia para não modificar o array original

  // Filtra por categoria, ignorando maiúsculas/minúsculas
  if (currentCategory !== "all") {
    filtered = filtered.filter(s => s.category && s.category.toLowerCase() === currentCategory.toLowerCase());
  }

  // Filtra por nome, ignorando maiúsculas/minúsculas
  if (currentSearch) {
    filtered = filtered.filter(s => s.name && s.name.toLowerCase().includes(currentSearch.toLowerCase()));
  }

  renderSkins(filtered);
}

// ============================
// EVENTOS DE FILTRO
// ============================
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove classes de todos os botões, depois adiciona ao clicado
    categoryButtons.forEach((b) => {
      b.classList.remove("active", "bg-blue-500");
      b.classList.add("bg-gray-700"); // Volta para a cor padrão
    });
    
    btn.classList.add("active", "bg-blue-500"); // Adiciona as classes ativas
    btn.classList.remove("bg-gray-700"); // Remove a cor padrão quando ativo

    currentCategory = btn.getAttribute("data-filter") || "all";
    applyFiltersAndSearch();
  });
});

// ============================
// EVENTO DE BUSCA
// ============================
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value || "";
  applyFiltersAndSearch();
});

// ============================
// INICIALIZAÇÃO
// ============================
document.addEventListener("DOMContentLoaded", () => {
  fetchSkins(); // Carrega as skins quando a página é carregada
  // O evento de redimensionamento não afeta diretamente a exibição das skins neste script,
  // mas pode ser útil se houver elementos responsivos adicionais.
  // window.addEventListener("resize", () => applyFiltersAndSearch()); 
});