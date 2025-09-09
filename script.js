// ============================
// SKINS MANUAIS EXEMPLO
// ============================
const SKINS = [
  // ============================
  // FACAS
  // ============================

  {
    nome: "★ Kukri Knife | Case Hardened",
    condicao: "Minimal Wear",
    categoria: "knives",
    float: 0.118,
    imagem: "imagens/skins/KukriCH.png",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000188E04202C2806300338CCE7C9EF0340830114D340D9",
    csfloatLink: "https://csfloat.com/item/885217832969830681",
    whatsapp: "https://wa.me/556799288899?text=Quero%20essa%20Kukri%20Case%20Hardened"
  },

  // ============================
  // LUVAS
  // ============================

  // {
  //   nome: "★ Specialist Gloves | Mogul",
  //   condicao: "Battle-Scarred",
  //   categoria: "gloves",
  //   float: 0.879,
  //   imagem: "imagens/skins/luvas_mogui.png",
  //   inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%200018AA2720D04E280630033883B2E8F90340E502792B7D3A",
  //   csfloatLink: "https://csfloat.com/item/879782342414174629",
  //   whatsapp: "https://wa.me/556799288899?text=Quero%20essas%20Specialist%20Gloves%20Mogul"
  // },

  // ============================
  // PISTOLAS
  // ============================

  // {
  //   nome: "Glock-18 | Gold Toof",
  //   condicao: "Field-Tested",
  //   categoria: "pistols",
  //   float: 0.315,
  //   imagem: "imagens/skins/glock.png",
  //   inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000180420810128063004389E9584F50340DA019D31FC92",
  //   csfloatLink: "https://csfloat.com/item/880125429116177470",
  //   whatsapp: "https://wa.me/556799288899?text=Quero%20essa%20Glock-18%20Gold%20Toof"
  // },

  // ============================
  // RIFLES
  // ============================

  // {
  //   nome: "AK-47 | Asiimov",
  //   condicao: "Field-Tested",
  //   categoria: "rifles",
  //   float: 0.233,
  //   imagem: "imagens/skins/akasii.png",
  //   inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000180720A10628063004388D97F3F20340A50262190800108B291D000000002D000040403D720B81BE45B065E23C7EBA2638",
  //   csfloatLink: "https://csfloat.com/item/880125221762369577",
  //   whatsapp: "https://wa.me/556799288899?text=Quero%20essa%20AK-47%20Asiimov"
  // },

  // ============================
  // SMGs
  // ============================

  // {
  //   nome: "MP9 | Hot Rod",
  //   condicao: "Minimal Wear",
  //   categoria: "smgs",
  //   float: 0.12,
  //   imagem: "imagens/skins/mp9.png",
  //   inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198869624827A34718817419D7216673156348019920",
  //   csfloatLink: "https://csfloat.com/item/884348488798830835",
  //   whatsapp: "https://wa.me/556799288899?text=Quero%20essa%20MP9%20Hot%20Rod"
  // },

  // ============================
  // PESADAS
  // ============================

  // {
  //   nome: "Negev | Lionfish",
  //   condicao: "Field-Tested",
  //   categoria: "heavy",
  //   float: 0.26,
  //   imagem: "imagens/skins/negev.png",
  //   inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000181C20BA052804300438A48FC2F20340D1020103FE75",
  //   csfloatLink: "https://csfloat.com/item/881253115297401792",
  //   whatsapp: "https://wa.me/556799288899?text=Quero%20essa%20Negev%20Lionfish"
  // },

  // ============================
  // ADESIVOS
  // ============================

  // {
  //   nome: "Adesivo | Teste",
  //   categoria: "stickers",
  //   imagem: "imagens/skins/adesivo.png",
  //   inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561199108593308A41905639961D5514201921302140417",
  //   csfloatLink: "https://csfloat.com/item/883476156446277971",
  //   whatsapp: "https://wa.me/556799288899?text=Quero%20esse%20Adesivo%20Teste"
  // },

  // // ============================
  // // AGENTES
  // // ============================

  // {
  //   nome: "Agente | Teste",
  //   categoria: "agents",
  //   imagem: "imagens/skins/agente.png",
  //   csfloatLink: "https://csfloat.com/item/885008170924248037",
  //   whatsapp: "https://wa.me/556799288899?text=Quero%20esse%20Agente%20Teste"
  // },

  // ============================
  // CAIXAS
  // ============================

  // {
  //   nome: "Caixa | Exemplo",
  //   categoria: "cases",
  //   imagem: "imagens/skins/caixa.png",
  //   csfloatLink: "https://csfloat.com/item/884535123658279606",
  //   whatsapp: "https://wa.me/556799288899?text=Quero%20essa%20Caixa%20Exemplo"
  // },

  // ============================
  // OUTROS
  // ============================ 

  {
    nome: "★ Kukri Knife | Blue Steel",
    condicao: "Field-Tested",
    categoria: "outros",
    float: 0.339,
    imagem: "imagens/skins/KukriBS.png",
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

  if (list.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "col-span-full text-center text-gray-400 text-lg mt-10 flex flex-col items-center justify-center";
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


  list.forEach(skin => {
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
        <div class="skin-card-name">${skin.nome}</div>
        <div class="skin-card-condition">${skin.condicao || ''}</div>
      </div>
      
      <div class="skin-card-body flex flex-col items-center p-4 relative">
        <img src="${skin.imagem}" alt="${skin.nome}" class="w-32 h-32 object-contain">

        ${skin.categoria === "outros" ? `
          <div class="ribbon-vendido">VENDIDO</div>
        ` : ""}

        ${skin.float !== undefined ? 
          `<span class="text-sm ${floatColor} mt-2 font-mono">Float: ${skin.float.toFixed(3)}</span>` : 
          '<div class="h-5 mt-2"></div>'
        }
      </div>

      <div class="skin-card-footer">
        <div class="flex gap-2 w-full justify-center">
          ${skin.inspectLink ? 
            `<a href="${skin.inspectLink}" class="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank">
              <i class="fa fa-eye text-xs"></i> ${isMobileView ? '' : '<span class="hidden sm:inline text-xs">Inspecionar</span>'}
            </a>` : ''
          }
          
          ${skin.csfloatLink ? 
            `<a href="${skin.csfloatLink}" class="bg-indigo-500 hover:bg-indigo-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank">
              <i class="fa fa-external-link text-xs"></i> ${isMobileView ? '' : '<span class="hidden sm:inline text-xs">CSFloat</span>'}
            </a>` : ''
          }

          ${skin.whatsapp ? 
            `<a href="${skin.whatsapp}" class="bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-sm" target="_blank">
              <i class="fa-brands fa-whatsapp text-xs"></i> ${isMobileView ? '' : '<span class="hidden sm:inline text-xs">WhatsApp</span>'}
            </a>` : ''
          }
        </div>
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
    categoryButtons.forEach(b => {
      b.classList.remove("active", "bg-blue-500");
      b.classList.add("bg-gray-700");
    });
    btn.classList.add("active", "bg-blue-500");
    btn.classList.remove("bg-gray-700");

    const filter = btn.getAttribute("data-filter");
    let filtered = SKINS;
    if (filter !== "all") filtered = SKINS.filter(s => s.categoria === filter);

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

document.addEventListener('DOMContentLoaded', () => {
  const allButton = document.querySelector('[data-filter="all"]');
  if (allButton) allButton.click();

  window.addEventListener('resize', () => renderSkins(SKINS));
});