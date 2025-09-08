// ============================
// SKINS MANUAIS
// ============================
const SKINS = [
  
  // ============================
  // Sessão de Facas
  // ============================
  {
    nome: "★ Karambit | Fade",
    condicao: "Factory New",
    categoria: "knives", // Categoria para facas
    float: 0.005,
    imagem: "imagens/skins/KAFADE.png",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000180720A10628063004388D97F3F20340A50262190800108B291D000000002D000040403D720B81BE45B065E23C7EBA2638",
    csfloatLink: "https://csfloat.com/item/883684185066307792",
    whatsapp: "https://wa.me/55SEUNUMERO?text=Quero%20essa%20Karambit%20Fade"
  },

  // ============================
  // Sessão de Luvas
  // ============================
  {
    nome: "★ Specialist Gloves | Mogul",
    condicao: "Battle-Scarred",
    categoria: "gloves", // Categoria para luvas
    float: 0.879,
    imagem: "imagens/skins/luvas_mogui.png",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%200018AA2720D04E280630033883B2E8F90340E502792B7D3A",
    csfloatLink: "https://csfloat.com/item/879782342414174629",
    whatsapp: "https://wa.me/55SEUNUMERO?text=Quero%20essas%20Specialist%20Gloves%20Mogul"
  },

  // ============================
  // Sessão de Rifles
  // ============================
  {
    nome: "AK-47 | Asiimov",
    condicao: "Field-Tested",
    categoria: "rifles", // Categoria para rifles
    float: 0.233,
    imagem: "imagens/skins/akasii.png",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000180720A10628063004388D97F3F20340A50262190800108B291D000000002D000040403D720B81BE45B065E23C7EBA2638",
    csfloatLink: "https://csfloat.com/item/880125221762369577",
    whatsapp: "https://wa.me/55SEUNUMERO?text=Quero%20essa%20AK-47%20Asiimov"
  },
  {
    nome: "M4A1-S | Black Lotus",
    condicao: "Field-Tested",
    categoria: "rifles", // Categoria para rifles
    float: 0.197,
    imagem: "imagens/skins/m4black.png",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000183C208E092805300438E189D8F20340FC064B649383",
    csfloatLink: "https://csfloat.com/item/880125785476825446",
    whatsapp: "https://wa.me/55SEUNUMERO?text=Quero%20essa%20M4A1-S%20Black%20Lotus"
  },
  
  // ============================
  // Sessão de Pistolas
  // ============================
  {
    nome: "Glock-18 | Gold Toof",
    condicao: "Field-Tested",
    categoria: "pistols", // Categoria para pistolas
    float: 0.315,
    imagem: "imagens/skins/glock.png",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000180420810128063004389E9584F50340DA019D31FC92",
    csfloatLink: "https://csfloat.com/item/880125429116177470",
    whatsapp: "https://wa.me/55SEUNUMERO?text=Quero%20essa%20Glock-18%20Gold%20Toof"
  },

  // ============================
  // Sessão de Adesivos
  // ============================
  {
    nome: "Adesivo | Teste",
    categoria: "stickers", // Categoria para adesivos
    imagem: "imagens/skins/adesiv.png",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561199108593308A41905639961D5514201921302140417",
    csfloatLink: "https://csfloat.com/item/883476156446277971",
    whatsapp: "https://wa.me/55SEUNUMERO?text=Quero%20esse%20Adesivo%20Teste"
  },
  
  // ============================
  // Sessão de Agentes
  // ============================
  {
    nome: "Agente | Teste",
    categoria: "agents", // Categoria para agentes
    imagem: "imagens/skins/agente.png",
    csfloatLink: "https://csfloat.com/item/803292537690394537",
    whatsapp: "https://wa.me/55SEUNUMERO?text=Quero%20esse%20Agente%20Teste"
  },

];


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

  list.forEach(skin => {
    const card = document.createElement("div");
    // Adicionando a classe skin-card para aplicar os estilos CSS personalizados
    card.className = `skin-card bg-gray-800 rounded-xl p-4 shadow-md transition flex flex-col items-center gap-4 ${skin.categoria}`;

    // Determinando a cor do valor do float com base na sua condição
    let floatColor = "text-white-500"; // Padrão branco
    if (skin.float <= 0.07) {
      floatColor = "text-blue-400";  // Factory New - Azul
    } else if (skin.float <= 0.15) {
      floatColor = "text-purple-400";  // Minimal Wear - Roxo
    } else if (skin.float <= 0.38) {
      floatColor = "text-yellow-500";  // Field-Tested - Amarelo
    } else if (skin.float <= 0.45) {
      floatColor = "text-orange-500";  // Well-Worn - Laranja
    } else {
      floatColor = "text-red-500";  // Battle-Scarred - Vermelho
    }

    // Verificar se é mobile para mostrar apenas ícones nos botões
    const isMobileView = isMobile();
    
    card.innerHTML = `
      <h3 class="text-lg font-bold text-center">${skin.nome}</h3>
      <span class="text-sm text-gray-400">${skin.condicao}</span>
      <img src="${skin.imagem}" alt="${skin.nome}" class="w-32 h-32 object-contain">

      <!-- Float Exato -->
      <span class="text-sm ${floatColor} mt-1 font-mono">Float: ${skin.float.toFixed(3)}</span>

      <!-- Botões -->
      <div class="flex gap-2 mt-4 w-full justify-center">
        <a href="${skin.inspectLink}" class="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors" target="_blank">
          <i class="fa fa-eye"></i> ${isMobileView ? '' : '<span class="hidden sm:inline">Inspecionar</span>'}
        </a>
        <a href="${skin.csfloatLink}" class="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors" target="_blank">
          <i class="fa fa-external-link"></i> ${isMobileView ? '' : '<span class="hidden sm:inline">CSFloat</span>'}
        </a>
        <a href="${skin.whatsapp}" class="bg-green-500 hover:bg-green-400 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors" target="_blank">
          <i class="fa-brands fa-whatsapp"></i> ${isMobileView ? '' : '<span class="hidden sm:inline">WhatsApp</span>'}
        </a>
      </div>
    `;

    skinsGrid.appendChild(card);
  });
}

// ============================
// FILTRO POR CATEGORIA
// ============================
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active", "bg-blue-500"));
    btn.classList.add("active", "bg-blue-500");
    btn.classList.remove("bg-gray-700");

    const filter = btn.getAttribute("data-filter");

    let filtered = SKINS;
    if (filter !== "all") {
      filtered = SKINS.filter(s => s.categoria === filter);
    }

    renderSkins(filtered);
  });
});

// ============================
// BUSCA POR NOME
// ============================
searchInput.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();

  const filtered = SKINS.filter(s => s.nome.toLowerCase().includes(query));
  renderSkins(filtered);
});

// ============================
// INICIALIZAÇÃO
// ============================
// Disparar evento de clique no botão "Todas" ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const allButton = document.querySelector('[data-filter="all"]');
  if (allButton) {
    allButton.click();
  }
  
  // Adicionar listener para redimensionamento da tela
  window.addEventListener('resize', () => {
    renderSkins(SKINS); // Re-renderizar para ajustar os botões
  });
});

// Renderizar as skins inicialmente
renderSkins(SKINS);