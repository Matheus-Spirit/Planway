// Função para carregar excursões do localStorage
function loadExcursionsFromLocalStorage() {
    const excursions = JSON.parse(localStorage.getItem("excursoes")) || [];

    displayExcursions(excursions);
}

// Função para exibir as excursões na página
function displayExcursions(excursions) {
    const listContainer = document.getElementById('excursionsList');
    listContainer.innerHTML = ''; // Limpa o conteúdo anterior

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
                        <p class="card-text">R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}</p>
                        <p class="card-text">${local}</p>
                        <p class="card-text">${formatDate(dataInicio)} - ${formatDate(dataFim)}</p>
                        <a href="ver_excursao.html?id=${id}" class="btn btn-outline-primary btn-block">Ver mais</a>
                    </div>
                </div>
        `;
        listContainer.appendChild(excursionCard);
    });
}

// Função para formatar datas no formato DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString) return "Data não disponível";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
    loadExcursionsFromLocalStorage();
    document.getElementById('searchInput').addEventListener('input', filterExcursions);
});
