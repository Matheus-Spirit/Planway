document.addEventListener("DOMContentLoaded", function () {
    const excursionForm = document.getElementById('excursionForm');
    const excursaoKey = "excursoes";
    const userEmail = localStorage.getItem('userEmail');

    // Função para gerar um ID único
    function generateUniqueId() {
        return 'excursao-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    // Função para recuperar os dados do formulário
    function getFormData() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const location = document.getElementById('location').value;
        const price = document.getElementById('price').value;
        const additionalServices = document.getElementById('additionalServices').value;
        const qtdPessoas = document.getElementById('qtdPessoas').value;

        return {
            id: generateUniqueId(), // Gera um ID único
            nome: title,
            descricao: description,
            dataInicio: startDate,
            dataFim: endDate,
            local: location,
            valor: parseFloat(price),
            servicosAdicionais: additionalServices || '',
            email: userEmail,
            quantidadePessoas: qtdPessoas
        };
    }

    // Função para salvar os dados no localStorage
    function saveToLocalStorage(excursionData) {
        const existingExcursoes = JSON.parse(localStorage.getItem(excursaoKey)) || [];
        existingExcursoes.push(excursionData); // Adiciona a nova excursão
        localStorage.setItem(excursaoKey, JSON.stringify(existingExcursoes)); // Salva no localStorage
        console.log("Excursão salva no localStorage:", excursionData);
    }

    // Função para manipular o envio do formulário
    function submitFormData(event) {
        event.preventDefault();

        const documento = localStorage.getItem('userDocumento');

        // Verificação se o usuário é uma agência
        if (!documento || documento.length !== 14) {
            alert('Você deve ser uma agência (CNPJ) para criar excursões.');
            return;
        }

        const formData = getFormData();
        saveToLocalStorage(formData);

        alert('Excursão cadastrada com sucesso!');
        excursionForm.reset();
    }

    // Adiciona o evento de submissão
    excursionForm.addEventListener('submit', submitFormData);
});
