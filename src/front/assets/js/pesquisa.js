// Função para carregar todas as excursões da API
function loadExcursionsFromAPI() {
    fetch('http://localhost:8081/api/excursoes/listExcursoes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar excursões da API');
            }
            return response.json();
        })
        .then(data => {
            displayExcursions(data);
        })
        .catch(error => {
            console.error('Erro ao buscar excursões:', error);
            alert('Erro ao buscar excursões da API.');
        });
}

// Função para exibir as excursões na página
function displayExcursions(excursions) {
    const listContainer = document.getElementById('excursionsList');
    listContainer.innerHTML = ''; 

    if (excursions.length === 0) {
        listContainer.innerHTML = '<p>Nenhuma excursão encontrada.</p>';
        return;
    }
    excursions.forEach(({ nome, descricao, valor, local, dataInicio, dataFim, id }) => {
        const excursionCard = document.createElement('div');
        excursionCard.classList.add('col-md-4', 'col-lg-3', 'col-sm-6', 'mb-4');

        excursionCard.innerHTML = `
                <div class="card" style="width: 350px;">
                    <div class="card-body">
                        <h5 class="card-title">${nome}</h5>
                        <p class="card-text">${descricao}</p>
                        <p class="card-text">R$ ${valor}</p>
                        <p class="card-text">${local}</p>
                        <p class="card-text">${dataInicio} - ${dataFim}</p>
                        <a href="ver_excursao.html?id=${id}" class="btn btn-outline-primary btn-block">Ver mais</a>
                    </div>
                </div>
        `;
        listContainer.appendChild(excursionCard);
    });
}

// Função para filtrar as excursões com base no campo de pesquisa
function filterExcursions() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const allExcursions = document.querySelectorAll('.card');

    allExcursions.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Espera o carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', function () {
    loadExcursionsFromAPI();
    document.getElementById('searchInput').addEventListener('input', filterExcursions);
});
