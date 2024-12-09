document.addEventListener("DOMContentLoaded", function () {
    function getUserEmail() {
        return localStorage.getItem('userEmail');
    }

    function loadUserExcursions() {
        const userEmail = getUserEmail();

        if (!userEmail) {
            alert("Usuário não encontrado. Faça login.");
            return;
        }

        fetch('http://localhost:8081/api/excursoes/listExcursoes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar excursões da API');
                }
                return response.json();
            })
            .then(apiExcursions => {
                const userActiveExcursions = apiExcursions.filter(excursion => excursion.email === userEmail);

                const pastExcursions = JSON.parse(localStorage.getItem('excursoesPast')) || [];
                const userPastExcursions = pastExcursions.filter(excursion => excursion.email === userEmail);

                displayExcursions(userActiveExcursions, userPastExcursions);
            })
            .catch(error => {
                console.error('Erro ao buscar excursões:', error);
                alert('Erro ao buscar excursões da API.');
            });
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
            activeExcursions.forEach(({ nome, descricao, valor, local, dataInicio, dataFim, id }) => {
                const excursionCard = document.createElement('div');
                excursionCard.classList.add('col-md-4', 'col-lg-12');

                excursionCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${nome}</h5>
                            <p class="card-text">${descricao}</p>
                            <p class="card-text"><strong>Preço:</strong> R$ ${valor.toFixed(2).replace('.', ',')}</p>
                            <p class="card-text"><strong>Local:</strong> ${local}</p>
                            <p class="card-text"><strong>Período:</strong> ${formatDate(dataInicio)} - ${formatDate(dataFim)}</p>
                            <p class="card-text"><strong>Status:</strong> Ativa</p>
                            <a href="detalhes_excursao.html?id=${id}&status=active" class="btn btn-outline-primary">Ver Detalhes</a>
                        </div>
                    </div>
                `;
                listContainer.appendChild(excursionCard);
            });
        }

        // Renderiza excursões finalizadas
        if (pastExcursions.length > 0) {
            pastExcursions.forEach(({ nome, descricao, valor, local, dataInicio, dataFim, id }) => {
                const excursionCard = document.createElement('div');
                excursionCard.classList.add('col-md-4', 'col-lg-12');

                excursionCard.innerHTML = `
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">${nome}</h5>
                            <p class="card-text">${descricao}</p>
                            <p class="card-text"><strong>Preço:</strong> R$ ${valor.toFixed(2).replace('.', ',')}</p>
                            <p class="card-text"><strong>Local:</strong> ${local}</p>
                            <p class="card-text"><strong>Período:</strong> ${formatDate(dataInicio)} - ${formatDate(dataFim)}</p>
                            <p class="card-text"><strong>Status:</strong> Finalizada</p>
                            <a href="detalhes_excursao.html?id=${id}&status=past" class="btn btn-outline-primary">Ver Detalhes</a>
                        </div>
                    </div>
                `;
                listContainer.appendChild(excursionCard);
            });
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    loadUserExcursions();
});
