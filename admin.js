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
        loadSkinsAdmin();
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
    document.getElementById("sold-card").innerHTML = "";
}

// ============================
// CARREGAR SKINS NO ADMIN
// ============================
async function loadSkinsAdmin() {
    const token = localStorage.getItem("token");
    if (!token) {
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
        soldCard.innerHTML = "";

        if (skins.length === 0) {
            soldCard.innerHTML = '<p class="col-span-full text-center text-gray-400">Nenhuma skin cadastrada ainda.</p>';
            return;
        }

        skins.forEach((skin) => {
            const card = document.createElement("div");
            card.className = "bg-gray-700 p-4 rounded-xl shadow-lg flex flex-col items-center text-center";
            card.innerHTML = `
                <img src="${skin.image}" alt="${skin.name}" class="w-full h-auto rounded-lg mb-2 object-cover aspect-video">
                <h3 class="text-lg font-semibold truncate w-full">${skin.name}</h3>
                <p class="text-sm text-gray-400">${skin.condition || 'N/A'}</p>
                ${skin.float ? `<p class="text-sm text-gray-400">Float: ${skin.float.toFixed(4)}</p>` : ''}
                
                <div class="flex flex-col gap-2 w-full mt-4">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" ${skin.sold ? "checked" : ""} data-id="${skin.id}" class="checkbox-vendido form-checkbox h-5 w-5 text-yellow-500 transition duration-150 ease-in-out rounded-full focus:ring-yellow-500">
                        <label class="text-sm cursor-pointer">${skin.sold ? 'Vendida' : 'Disponível'}</label>
                    </div>
                    <button class="remove-skin bg-red-600 hover:bg-red-500 text-white py-2 rounded text-sm w-full" data-id="${skin.id}">
                        Remover
                    </button>
                </div>
            `;
            soldCard.appendChild(card);
        });

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
                    loadSkinsAdmin();
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            });
        });

        document.querySelectorAll('.checkbox-vendido').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const span = checkbox.nextElementSibling;
                span.textContent = checkbox.checked ? 'Vendida' : 'Disponível';
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

    const name = document.getElementById("nome").value.trim();
    const condition = document.getElementById("condicao").value;
    const category = document.getElementById("categoria").value;
    const floatValue = document.getElementById("float").value.trim();
    const inspectLink = document.getElementById("inspectLink").value.trim();
    const csfloatLink = document.getElementById("csfloatLink").value.trim();
    const whatsappMsg = document.getElementById("whatsappMsg").value.trim();

    const imageUrl = document.getElementById("imagemLink").value.trim();
    const imageUpload = document.getElementById("imagemUpload").files[0];

    if (!name || !condition || !category) {
        return alert("Preencha os campos obrigatórios (Nome, Condição, Categoria).");
    }
    if (!imageUrl && !imageUpload) {
        return alert("É necessário fornecer um link de imagem ou fazer o upload de uma imagem.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("condition", condition);
    formData.append("category", category);
    if (floatValue) formData.append("floatValue", floatValue);
    if (inspectLink) formData.append("inspectLink", inspectLink);
    if (csfloatLink) formData.append("csfloatLink", csfloatLink);
    formData.append("whatsapp", whatsappMsg);

    if (imageUpload) {
        formData.append("image", imageUpload);
    } else {
        formData.append("image", imageUrl);
    }

    try {
        const res = await fetch(`${API_URL}/skins`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
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

        const msgEl = document.getElementById("save-message");
        msgEl.textContent = "✅ Skin cadastrada com sucesso!";
        msgEl.classList.remove("hidden");
        msgEl.classList.replace("text-red-400", "text-green-400");
        
        e.target.reset();
        loadSkinsAdmin();
    } catch (err) {
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
        for (const skinData of skinsToUpdate) {
            const res = await fetch(`${API_URL}/skins/${skinData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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
        loadSkinsAdmin();
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
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("admin-section").classList.remove("hidden");
        // A carga inicial das skins só deve acontecer quando a modal de remoção for aberta, para evitar requisições desnecessárias.
    } else {
        document.getElementById("login-section").classList.remove("hidden");
        document.getElementById("admin-section").classList.add("hidden");
    }
});