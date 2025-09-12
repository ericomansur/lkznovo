
        // ============================
        // CONFIG
        // ============================
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

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Usuário ou senha inválidos");
                }

                const data = await res.json();
                sessionStorage.setItem("token", data.token);
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
            sessionStorage.removeItem("token");
            document.getElementById("admin-section").classList.add("hidden");
            document.getElementById("login-section").classList.remove("hidden");
            document.getElementById("sold-card").innerHTML = "";
        }

        // ============================
        // CARREGAR SKINS NO ADMIN
        // ============================
        async function loadSkinsAdmin() {
            const token = sessionStorage.getItem("token");
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
                    soldCard.innerHTML = `
                        <div class="text-center py-12">
                            <svg class="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                            </svg>
                            <p class="text-slate-400 text-lg">Nenhuma skin cadastrada ainda</p>
                        </div>
                    `;
                    return;
                }

                skins.forEach((skin) => {
                    const card = document.createElement("div");
                    card.className = "bg-slate-700/50 border border-slate-600 rounded-xl p-4 transition-all hover:bg-slate-700/70 hover:border-blue-500/30";
                    card.innerHTML = `
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div class="flex-1 space-y-2">
                                <h3 class="text-lg font-semibold text-white truncate">${skin.name}</h3>
                                <div class="flex flex-wrap gap-2 text-sm">
                                    <span class="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-lg">${skin.condition || 'N/A'}</span>
                                    ${skin.float ? `<span class="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-lg">Float: ${skin.float.toFixed(4)}</span>` : ''}
                                </div>
                            </div>
                            
                            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" ${skin.sold ? "checked" : ""} data-id="${skin.id}" 
                                           class="checkbox-vendido w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2">
                                    <span class="text-sm font-medium ${skin.sold ? 'text-green-400' : 'text-amber-400'}">${skin.sold ? 'Vendida' : 'Disponível'}</span>
                                </div>
                                <button class="remove-skin bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95" data-id="${skin.id}">
                                    <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Remover
                                </button>
                            </div>
                        </div>
                    `;
                    soldCard.appendChild(card);
                });

                // Event listeners para remoção
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

                // Event listeners para checkboxes
                document.querySelectorAll('.checkbox-vendido').forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        const span = checkbox.nextElementSibling;
                        if (checkbox.checked) {
                            span.textContent = 'Vendida';
                            span.className = 'text-sm font-medium text-green-400';
                        } else {
                            span.textContent = 'Disponível';
                            span.className = 'text-sm font-medium text-amber-400';
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
            const token = sessionStorage.getItem("token");
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
                msgEl.classList.remove("hidden", "text-red-400", "bg-red-900/20", "border-red-500/30");
                msgEl.classList.add("text-green-400", "bg-green-900/20", "border", "border-green-500/30");
                
                e.target.reset();
                loadSkinsAdmin();
            } catch (err) {
                const msgEl = document.getElementById("save-message");
                msgEl.textContent = `❌ ${err.message}`;
                msgEl.classList.remove("hidden", "text-green-400", "bg-green-900/20", "border-green-500/30");
                msgEl.classList.add("text-red-400", "bg-red-900/20", "border", "border-red-500/30");
                console.error(err);
            }
        });

        // ============================
        // ATUALIZAR SKINS VENDIDAS
        // ============================
        document.getElementById("update-sold").addEventListener("click", async () => {
            const token = sessionStorage.getItem("token");
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
        // NAVEGAÇÃO ENTRE MODALS
        // ============================
        const btnCadastrar = document.getElementById("btn-cadastrar");
        const btnRemover = document.getElementById("btn-remover");
        const modalCadastrar = document.getElementById("modal-cadastrar");
        const modalRemover = document.getElementById("modal-remover");

        btnCadastrar.addEventListener("click", () => {
            modalCadastrar.classList.remove("hidden");
            modalRemover.classList.add("hidden");
            btnCadastrar.classList.add("ring-2", "ring-emerald-400");
            btnRemover.classList.remove("ring-2", "ring-amber-400");
        });

        btnRemover.addEventListener("click", () => {
            modalRemover.classList.remove("hidden");
            modalCadastrar.classList.add("hidden");
            btnRemover.classList.add("ring-2", "ring-amber-400");
            btnCadastrar.classList.remove("ring-2", "ring-emerald-400");
            loadSkinsAdmin();
        });

        // ============================
        // INICIALIZAÇÃO
        // ============================
        document.addEventListener("DOMContentLoaded", () => {
            const token = sessionStorage.getItem("token");
            if (token) {
                document.getElementById("login-section").classList.add("hidden");
                document.getElementById("admin-section").classList.remove("hidden");
                // Abrir modal cadastrar por padrão
                modalCadastrar.classList.remove("hidden");
                btnCadastrar.classList.add("ring-2", "ring-emerald-400");
            } else {
                document.getElementById("login-section").classList.remove("hidden");
                document.getElementById("admin-section").classList.add("hidden");
            }
        });

        // ============================
        // ENTER KEY LOGIN
        // ============================
        document.getElementById("username").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                document.getElementById("password").focus();
            }
        });

        document.getElementById("password").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                login();
            }
        });