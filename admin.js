const API_URL = "https://lkz-store-backend.onrender.com";

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

    if (!res.ok) throw new Error("Login inválido");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("admin-section").classList.remove("hidden");
    loadSoldSkins();
  } catch (err) {
    document.getElementById("login-error").classList.remove("hidden");
  }
}

// ============================
// CADASTRO SKIN
// ============================
document.getElementById("skin-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("Faça login novamente.");

  const nome = document.getElementById("nome").value;
  const condicao = document.getElementById("condicao").value;
  const categoria = document.getElementById("categoria").value;
  const float = document.getElementById("float").value || "";
  const inspectLink = document.getElementById("inspectLink").value;
  const csfloatLink = document.getElementById("csfloatLink").value;
  const whatsappMsg = encodeURIComponent(document.getElementById("whatsappMsg").value);

  const imagemLink = document.getElementById("imagemLink").value;
  const imagemUpload = document.getElementById("imagemUpload").files[0];

  if (!imagemLink && !imagemUpload) {
    alert("Preencha o link da imagem ou faça upload da imagem.");
    return;
  }

  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("condicao", condicao);
  formData.append("categoria", categoria);
  formData.append("float", float);
  formData.append("inspectLink", inspectLink);
  formData.append("csfloatLink", csfloatLink);
  formData.append("whatsapp", `https://wa.me/556799288899?text=${whatsappMsg}`);

  if (imagemUpload) {
    formData.append("imagem", imagemUpload);
  } else {
    formData.append("imagem", imagemLink);
  }

  try {
    const res = await fetch(`${API_URL}/skins`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Erro ao salvar");

    const msgEl = document.getElementById("save-message");
    msgEl.textContent = "✅ Skin cadastrada com sucesso!";
    msgEl.classList.remove("hidden");
    msgEl.classList.replace("text-red-400", "text-green-400");
    e.target.reset();
    loadSoldSkins(); // atualiza lista de skins vendidas
  } catch (err) {
    const msgEl = document.getElementById("save-message");
    msgEl.textContent = "❌ Erro ao salvar skin.";
    msgEl.classList.remove("hidden");
    msgEl.classList.replace("text-green-400", "text-red-400");
  }
});

// ============================
// LOGOUT
// ============================
function logout() {
  localStorage.removeItem("token");
  document.getElementById("admin-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
}

// ============================
// MODAL VENDIDO
// ============================
const modalRemover = document.getElementById("modal-remover");
const btnRemover = document.getElementById("btn-remover");
const modalCadastrar = document.getElementById("modal-cadastrar");
const btnCadastrar = document.getElementById("btn-cadastrar");

btnCadastrar.addEventListener("click", () => {
  modalCadastrar.classList.remove("hidden");
  modalRemover.classList.add("hidden");
});

btnRemover.addEventListener("click", () => {
  modalRemover.classList.remove("hidden");
  modalCadastrar.classList.add("hidden");
  loadSoldSkins();
});

// ============================
// CARREGAR SKINS PARA MARCAR VENDIDAS
// ============================
async function loadSoldSkins() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/skins`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao buscar skins");
    const skins = await res.json();

    const soldCard = document.getElementById("sold-card");
    soldCard.innerHTML = "";

    skins.forEach((skin) => {
      const div = document.createElement("div");
      div.className = "flex items-center justify-between bg-gray-700 p-2 rounded";
      div.innerHTML = `
        <label class="flex items-center gap-2 w-full cursor-pointer">
          <input type="checkbox" ${skin.vendido ? "checked" : ""} data-id="${skin.id}" class="checkbox-vendido">
          <span class="truncate">${skin.nome} (${skin.condicao})</span>
        </label>
      `;
      soldCard.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// ============================
// ATUALIZAR STATUS VENDIDO
// ============================
document.getElementById("update-sold").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const checkboxes = document.querySelectorAll(".checkbox-vendido");
  const updates = [];

  checkboxes.forEach((cb) => {
    updates.push({
      id: cb.dataset.id,
      vendido: cb.checked,
    });
  });

  try {
    const res = await fetch(`${API_URL}/skins/vendido`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Erro ao atualizar skins");
    alert("✅ Skins atualizadas com sucesso!");
    loadSoldSkins();
  } catch (err) {
    console.error(err);
    alert("❌ Erro ao atualizar skins");
  }
});
