document.addEventListener("DOMContentLoaded", function () {
    // Recupera o email do usuário
    function getUserEmail() {
        return localStorage.getItem('userEmail');
    }

    // Função principal para carregar excursões
    function loadUserExcursions() {
        const userEmail = getUserEmail();

        if (!userEmail) {
            alert("Usuário não encontrado. Faça login.");
            window.location.href = "index.html";
            return;
        }

        // Recupera excursões do localStorage
        const allExcursions = JSON.parse(localStorage.getItem("excursoes")) || [];
        const pastExcursions = JSON.parse(localStorage.getItem("excursoesPast")) || [];

        // Filtra excursões pelo email do usuário
        const userActiveExcursions = allExcursions.filter(excursion => excursion.email === userEmail);
        const userPastExcursions = pastExcursions.filter(excursion => excursion.email === userEmail);

        // Renderiza as excursões na página
        displayExcursions(userActiveExcursions, userPastExcursions);
    }

    // Função para exibir as excursões do usuário na página
    function displayExcursions(activeExcursions, pastExcursions) {
        const listContainer = document.getElementById('excursionsList');
        listContainer.innerHTML = '';

        if (activeExcursions.length === 0 && pastExcursions.length === 0) {
            listContainer.innerHTML = '<p>Você ainda não criou nenhuma excursão.</p>';
            return;
        }

        // Renderiza excursões ativas
        if (activeExcursions.length > 0) {
            listContainer.innerHTML += `<h4>Excursões Ativas</h4>`;
            activeExcursions.forEach(excursion => {
                const card = createExcursionCard(excursion, "Ativa", "active");
                listContainer.appendChild(card);
            });
        }

        // Renderiza excursões finalizadas
        if (pastExcursions.length > 0) {
            listContainer.innerHTML += `<h4>Excursões Finalizadas</h4>`;
            pastExcursions.forEach(excursion => {
                const card = createExcursionCard(excursion, "Finalizada", "past");
                listContainer.appendChild(card);
            });
        }
    }

    // Cria um card de excursão
    function createExcursionCard(excursion, status, statusType) {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'col-lg-12', 'mb-3');

        card.innerHTML = `
            <div class="card ${status === "Finalizada" ? 'bg-light' : ''}">
                <div class="card-body">
                    <h5 class="card-title">${excursion.nome}</h5>
                    <p class="card-text">${excursion.descricao}</p>
                    <p class="card-text"><strong>Preço:</strong> R$ ${excursion.valor.toFixed(2).replace('.', ',')}</p>
                    <p class="card-text"><strong>Local:</strong> ${excursion.local}</p>
                    <p class="card-text"><strong>Período:</strong> ${formatDate(excursion.dataInicio)} - ${formatDate(excursion.dataFim)}</p>
                    <p class="card-text"><strong>Status:</strong> ${status}</p>
                    <a href="detalhes_excursao.html?id=${excursion.id}&status=${statusType}" class="btn btn-outline-primary">Ver Detalhes</a>
                </div>
            </div>
        `;
        return card;
    }

    // Formata datas
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Inicializa a função principal
    loadUserExcursions();
});
