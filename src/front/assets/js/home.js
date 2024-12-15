document.addEventListener("DOMContentLoaded", function () {
    const userType = sessionStorage.getItem('userType');
    const userEmail = localStorage.getItem("userEmail");
    const excursions = JSON.parse(localStorage.getItem("excursoes")) || [];

    // Configura visibilidade das seções com base no tipo de usuário
    if (userType === 'cliente') {
        document.getElementById('cadastrarSection').style.display = 'none';
        document.getElementById('verExcursaoSection').style.display = 'none';
    } else if (userType === 'agencia') {
        document.getElementById('cadastrarSection').style.display = 'block';
        document.getElementById('verExcursaoSection').style.display = 'block';
    } else {
        window.location.href = 'index.html';
    }

    // Verificar e exibir a participação do usuário em excursões
    function checkParticipation() {
        const participationSection = document.getElementById("participationSection");

        const userParticipatingExcursion = excursions.find(excursion =>
            excursion.participantes && excursion.participantes.includes(userEmail)
        );

        if (userParticipatingExcursion) {
            const participationMessage = `
                <div class="alert alert-info" role="alert">
                    <h4 class="alert-heading">Você está participando de uma excursão!</h4>
                    <p><strong>Excursão:</strong> ${userParticipatingExcursion.nome}</p>
                    <p><strong>Data de início:</strong> ${formatDate(userParticipatingExcursion.dataInicio)}</p>
                    <p><strong>Data de término:</strong> ${formatDate(userParticipatingExcursion.dataFim)}</p>
                    <hr>
                    <p class="mb-0">Não se esqueça de acompanhar as informações e deixar sua avaliação no final da viagem!</p>
                    <a href="descricao.html?id=${userParticipatingExcursion.id}" class="btn btn-primary mt-3">Ver Detalhes</a>
                </div>
            `;
            participationSection.innerHTML = participationMessage;
        } else {
            const noParticipationMessage = `
                <div class="alert alert-warning" role="alert">
                    <h3 class="alert-heading">Você ainda não está participando de nenhuma excursão.</h3>
                    <p>Pesquise por excursões e participe de uma para começar sua jornada!</p>
                </div>
            `;
            participationSection.innerHTML = noParticipationMessage;
        }
    }

    // Função para formatar as datas
    function formatDate(dateString) {
        if (!dateString) return "Data não disponível";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    checkParticipation();
});

window.onload = function () {
    const carouselItemsContainer = document.getElementById('carouselItems');
    const storedExcursions = JSON.parse(localStorage.getItem("excursoes")) || [];

    // Verifica se existem excursões no localStorage
    if (storedExcursions.length === 0) {
        carouselItemsContainer.innerHTML = '<h4>Nenhuma excursão cadastrada.</h4>';
        return;
    }

    // Carrega as excursões do localStorage no carrossel
    storedExcursions.forEach((excursion, index) => {
        const imageUrl = excursion.imagem || 'https://via.placeholder.com/800x300?text=Sem+Imagem';
        const isActiveClass = index === 0 ? 'active' : '';

        const carouselItem = `
            <div class="carousel-item ${isActiveClass}">
                <img src="${imageUrl}" class="d-block" style="width: 50%; margin: 0 auto;" alt="Excursão ${index + 1}">
                <div class="excursion-info-box w-50">
                    <h5>${excursion.nome}</h5>
                    <p><strong>Local:</strong> ${excursion.local}</p>
                    <p><strong>Preço:</strong> R$ ${excursion.valor.toFixed(2)}</p>
                    <a href="ver_excursao.html?id=${excursion.id}" class="btn btn-primary">Saiba Mais</a>
                </div>
            </div>
        `;

        carouselItemsContainer.innerHTML += carouselItem;
    });
};
