// Carrega os dados do perfil
function loadProfile() {
    const email = localStorage.getItem('userEmail');
    const documento = localStorage.getItem('userDocumento');

    if (email) {
        document.getElementById('email').value = email;
    } else {
        document.getElementById('email').value = 'E-mail não encontrado';
    }

    if (documento) {
        document.getElementById('cpfCnpj').value = documento;
    } else {
        document.getElementById('cpfCnpj').value = 'CPF/CNPJ não encontrado';
    }

    loadRatings(email); // Carrega as avaliações das excursões
}

// Calcula e exibe as avaliações das excursões organizadas pelo usuário
function loadRatings(email) {
    const excursions = JSON.parse(localStorage.getItem('excursoes')) || [];
    const excursionsPast = JSON.parse(localStorage.getItem('excursoesPast')) || [];
    const allExcursions = [...excursions, ...excursionsPast];

    // Filtra as excursões organizadas pelo usuário
    const userExcursions = allExcursions.filter(excursion => excursion.email === email);

    if (userExcursions.length === 0) {
        document.getElementById('ratingsSummary').textContent = "Você ainda não possui avaliações em suas excursões.";
        return;
    }

    let totalStars = 0;
    let totalRatings = 0;

    userExcursions.forEach(excursion => {
        if (excursion.avaliacoes && excursion.avaliacoes.length > 0) {
            totalStars += excursion.avaliacoes.reduce((sum, rating) => sum + rating, 0);
            totalRatings += excursion.avaliacoes.length;
        }
    });

    const averageRating = totalRatings > 0 ? (totalStars / totalRatings).toFixed(2) : 0;

    // Atualiza o DOM
    document.getElementById('ratingsSummary').innerHTML = `
        <h4>Total de avaliações: ${totalRatings}</h4>
        <h4>Média de estrelas: ${averageRating} ★</h4>
    `;
}

// Edita o perfil que habilita os campos para alteração
function enableEdit() {
    document.getElementById('email').removeAttribute('readonly');
    document.getElementById('cpfCnpj').removeAttribute('readonly');
    document.getElementById('editProfileBtn').style.display = 'none';
    document.getElementById('deleteProfileBtn').style.display = 'none';
    document.getElementById('saveProfileBtn').style.display = 'inline-block';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

// Salva as alterações feitas no perfil
function saveProfile() {
    const email = document.getElementById('email').value;
    const documento = document.getElementById('cpfCnpj').value;

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userDocumento', documento);

    alert("Perfil atualizado com sucesso!");
    disableEdit();
}

// Cancela a edição do perfil
function disableEdit() {
    document.getElementById('email').setAttribute('readonly', true);
    document.getElementById('cpfCnpj').setAttribute('readonly', true);
    document.getElementById('editProfileBtn').style.display = 'inline-block';
    document.getElementById('deleteProfileBtn').style.display = 'inline-block';
    document.getElementById('saveProfileBtn').style.display = 'none';
    document.getElementById('cancelEditBtn').style.display = 'none';
    loadProfile();
}

// Deleta o perfil do localStorage
function deleteProfile() {
    if (confirm("Tem certeza de que deseja deletar seu perfil? Esta ação é irreversível.")) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userDocumento');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userType');
        window.location.href = 'index.html';
    }
}

document.getElementById('editProfileBtn').addEventListener('click', enableEdit);
document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
document.getElementById('cancelEditBtn').addEventListener('click', disableEdit);
document.getElementById('deleteProfileBtn').addEventListener('click', deleteProfile);
window.onload = loadProfile;
