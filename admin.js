// ============================
// CONFIG
// ============================
const API_URL = "https://lkz-store-backend.onrender.com"; // Use a URL da sua API

// ============================
// LOGIN
// ============================
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Usuário ou senha inválidos");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("admin-section").classList.remove("hidden");
    loadSkinsAdmin(); // Carrega as skins após o login bem-sucedido
  } catch (err) {
    const errEl = document.getElementById("login-error");
    errEl.textContent = err.message;
    errEl.classList.remove("hidden");
  }
}

// ============================
// LOGOUT
// ============================
function logout() {
  localStorage.removeItem("token");
  document.getElementById("admin-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
  // Limpa a lista de skins para evitar que sejam exibidas antes do login
  document.getElementById("sold-card").innerHTML = ""; 
}

// ============================
// CARREGAR SKINS NO ADMIN
// ============================
async function loadSkinsAdmin() {
  const token = localStorage.getItem("token");
  if (!token) {
    // Se não houver token, redireciona para login
    document.getElementById("admin-section").classList.add("hidden");
    document.getElementById("login-section").classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/skins`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      alert("Seu login expirou ou não tem permissão. Faça login novamente.");
      logout();
      return;
    }

    if (!res.ok) throw new Error("Erro ao buscar skins");
    const skins = await res.json();

    const soldCard = document.getElementById("sold-card");
    soldCard.innerHTML = ""; // Limpa o conteúdo anterior

    if (skins.length === 0) {
      soldCard.innerHTML = '<p class="text-center text-gray-400">Nenhuma skin cadastrada ainda.</p>';
      return;
    }

    skins.forEach((skin) => {
      const div = document.createElement("div");
      div.className = "flex items-center justify-between bg-gray-700 p-2 rounded mb-2";
      div.innerHTML = `
        <label class="flex items-center gap-2 w-full cursor-pointer">
          <input type="checkbox" ${skin.sold ? "checked" : ""} data-id="${skin.id}" class="checkbox-vendido form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out">
          <span class="truncate flex-1">${skin.name} (${skin.condition || 'N/A'})</span>
        </label>
        <button class="remove-skin bg-red-500 hover:bg-red-400 px-2 py-1 rounded text-sm text-white ml-2" data-id="${skin.id}">Remover</button>
      `;
      soldCard.appendChild(div);
    });

    // Adiciona event listeners para os botões de remover
    document.querySelectorAll(".remove-skin").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("Deseja realmente remover esta skin? Esta ação é irreversível.")) return;

        try {
          const res = await fetch(`${API_URL}/skins/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.status === 401 || res.status === 403) {
            alert("Seu login expirou. Faça login novamente.");
            logout();
            return;
          }

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Erro ao remover skin");
          }
          
          alert("Skin removida com sucesso!");
          loadSkinsAdmin(); // Recarrega a lista após a remoção
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      });
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// ============================
// CADASTRO DE SKIN
// ============================
document.getElementById("skin-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Faça login novamente.");
    return;
  }

  // Coleta os dados do formulário
  const name = document.getElementById("nome").value.trim();
  const condition = document.getElementById("condicao").value;
  const category = document.getElementById("categoria").value;
  const floatValue = document.getElementById("float").value.trim();
  const inspectLink = document.getElementById("inspectLink").value.trim();
  const csfloatLink = document.getElementById("csfloatLink").value.trim();
  const whatsappMsg = document.getElementById("whatsappMsg").value.trim(); // Mensagem de texto para o WhatsApp

  const imageUrl = document.getElementById("imagemLink").value.trim();
  const imageUpload = document.getElementById("imagemUpload").files[0];

  // Validações básicas
  if (!name || !condition || !category) {
    return alert("Preencha os campos obrigatórios (Nome, Condição, Categoria).");
  }
  if (!imageUrl && !imageUpload) {
    return alert("É necessário fornecer um link de imagem ou fazer o upload de uma imagem.");
  }

  // Cria um FormData para enviar tanto arquivos quanto dados de texto
  const formData = new FormData();
  formData.append("name", name);
  formData.append("condition", condition);
  formData.append("category", category);
  if (floatValue) formData.append("floatValue", floatValue); // Adiciona apenas se preenchido
  if (inspectLink) formData.append("inspectLink", inspectLink); // Adiciona apenas se preenchido
  if (csfloatLink) formData.append("csfloatLink", csfloatLink); // Adiciona apenas se preenchido
  formData.append("whatsapp", whatsappMsg); // Envia a mensagem pura

  if (imageUpload) {
    formData.append("image", imageUpload); // Se houver upload, envia o arquivo
  } else {
    formData.append("image", imageUrl); // Caso contrário, envia o link
  }

  try {
    const res = await fetch(`${API_URL}/skins`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      body: formData, // Envia o FormData
    });

    if (res.status === 401 || res.status === 403) {
      alert("Seu login expirou. Faça login novamente.");
      logout();
      return;
    }

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Erro ao salvar skin");
    }

    // Feedback de sucesso
    const msgEl = document.getElementById("save-message");
    msgEl.textContent = "✅ Skin cadastrada com sucesso!";
    msgEl.classList.remove("hidden");
    msgEl.classList.replace("text-red-400", "text-green-400");
    
    e.target.reset(); // Limpa o formulário
    loadSkinsAdmin(); // Recarrega a lista de skins
  } catch (err) {
    // Feedback de erro
    const msgEl = document.getElementById("save-message");
    msgEl.textContent = `❌ ${err.message}`;
    msgEl.classList.remove("hidden");
    msgEl.classList.replace("text-green-400", "text-red-400");
    console.error(err);
  }
});

// ============================
// ATUALIZAR SKINS VENDIDAS
// ============================
document.getElementById("update-sold").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Faça login novamente.");
    return;
  }

  const checkboxes = document.querySelectorAll(".checkbox-vendido");
  const skinsToUpdate = [];

  checkboxes.forEach(cb => {
    skinsToUpdate.push({ id: cb.dataset.id, sold: cb.checked });
  });

  try {
    // Para cada checkbox, faz uma requisição PUT individual
    // Em um sistema com muitas skins, poderia ser otimizado para um único POST/PUT com um array
    for (const skinData of skinsToUpdate) {
      const res = await fetch(`${API_URL}/skins/${skinData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Envia apenas o status 'sold' para a atualização
        body: JSON.stringify({ sold: skinData.sold }), 
      });

      if (res.status === 401 || res.status === 403) {
        alert("Seu login expirou. Faça login novamente.");
        logout();
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erro ao atualizar skin ${skinData.id}`);
      }
    }
    alert("✅ Status das skins atualizado com sucesso!");
    loadSkinsAdmin(); // Recarrega a lista após a atualização
  } catch (err) {
    console.error(err);
    alert(`❌ ${err.message}`);
  }
});

// ============================
// INICIALIZAÇÃO - VERIFICA LOGIN AO CARREGAR PÁGINA
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    // Se já tiver token, tenta carregar as skins admin
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("admin-section").classList.remove("hidden");
    loadSkinsAdmin();
  } else {
    // Caso contrário, mostra a seção de login
    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("admin-section").classList.add("hidden");
  }
});