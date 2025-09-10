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
    loadSkinsAdmin();
  } catch (err) {
    document.getElementById("login-error").classList.remove("hidden");
  }
}

// ============================
// LOGOUT
// ============================
function logout() {
  localStorage.removeItem("token");
  document.getElementById("admin-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
}

// ============================
// CARREGAR SKINS NO ADMIN
// ============================
async function loadSkinsAdmin() {
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
      div.className = "flex items-center justify-between bg-gray-700 p-2 rounded mb-2";
      div.innerHTML = `
        <label class="flex items-center gap-2 w-full cursor-pointer">
          <input type="checkbox" ${skin.sold ? "checked" : ""} data-id="${skin.id}" class="checkbox-vendido">
          <span class="truncate">${skin.name} (${skin.condition})</span>
        </label>
        <button class="remove-skin bg-red-500 hover:bg-red-400 px-2 py-1 rounded text-sm text-white" data-id="${skin.id}">Remover</button>
      `;
      soldCard.appendChild(div);
    });

    // Eventos para remover skins
    document.querySelectorAll(".remove-skin").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("Deseja realmente remover esta skin?")) return;

        try {
          const res = await fetch(`${API_URL}/skins/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Erro ao remover skin");
          loadSkinsAdmin();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
}

// ============================
// CADASTRO DE SKIN
// ============================
document.getElementById("skin-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("Faça login novamente.");

  const name = document.getElementById("nome").value;
  const condition = document.getElementById("condicao").value;
  const category = document.getElementById("categoria").value;
  const floatValue = document.getElementById("float").value || null;
  const inspectLink = document.getElementById("inspectLink").value || null;
  const csfloatLink = document.getElementById("csfloatLink").value || null;
  const whatsappMsg = encodeURIComponent(document.getElementById("whatsappMsg").value);

  const imageUrl = document.getElementById("imagemLink").value;
  const imageUpload = document.getElementById("imagemUpload").files[0];

  if (!imageUrl && !imageUpload) return alert("Preencha o link da imagem ou faça upload da imagem.");

  const formData = new FormData();
  formData.append("nome", name);
  formData.append("condicao", condition);
  formData.append("categoria", category);
  formData.append("float", floatValue);
  formData.append("inspectLink", inspectLink);
  formData.append("csfloatLink", csfloatLink);
  formData.append("whatsapp", `https://wa.me/556799288899?text=${whatsappMsg}`);

  if (imageUpload) formData.append("imagem", imageUpload);
  else formData.append("imagem", imageUrl);

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
    loadSkinsAdmin();
  } catch (err) {
    const msgEl = document.getElementById("save-message");
    msgEl.textContent = "❌ Erro ao salvar skin.";
    msgEl.classList.remove("hidden");
    msgEl.classList.replace("text-green-400", "text-red-400");
  }
});


// ============================
// ATUALIZAR SKINS VENDIDAS
// ============================
document.getElementById("update-sold").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const checkboxes = document.querySelectorAll(".checkbox-vendido");

  try {
    for (const cb of checkboxes) {
      const res = await fetch(`${API_URL}/skins/${cb.dataset.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sold: cb.checked }),
      });
      if (!res.ok) throw new Error(`Erro ao atualizar skin ${cb.dataset.id}`);
    }
    alert("✅ Skins atualizadas com sucesso!");
    loadSkinsAdmin();
  } catch (err) {
    console.error(err);
    alert("❌ Erro ao atualizar skins");
  }
});
