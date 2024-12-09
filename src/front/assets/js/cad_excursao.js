document.addEventListener("DOMContentLoaded", function () {
    const excursionForm = document.getElementById('excursionForm');
    const excursaoKey = "excursoes"; 
    const userEmail = localStorage.getItem('userEmail');

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

    // Função para salvar os dados no localStorage com ID correto
    function saveToLocalStorageWithId(excursionData, id) {
        const existingExcursoes = JSON.parse(localStorage.getItem(excursaoKey)) || [];
        const existingExcursionIndex = existingExcursoes.findIndex(e => e.id === id);
        if (existingExcursionIndex !== -1) {
            existingExcursoes[existingExcursionIndex] = { ...excursionData, id };
        } else {
            existingExcursoes.push({ ...excursionData, id });
        }

        localStorage.setItem(excursaoKey, JSON.stringify(existingExcursoes));
        console.log("Excursão salva no localStorage:", { ...excursionData, id });
    }

    // Função para enviar os dados para a API e salvar no localStorage
    function submitFormData(event) {
        event.preventDefault();

        const documento = localStorage.getItem('userDocumento');

        if (!documento || documento.length !== 14) {
            alert('Você deve ser uma agência (CNPJ) para criar excursões.');
            return; 
        }

        const formData = getFormData();

        fetch('http://localhost:8081/api/excursoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao criar excursão');
                }
                return response.json(); 
            })
            .then((data) => {
                alert('Excursão criada com sucesso!');

                saveToLocalStorageWithId(formData, data.id);

                excursionForm.reset();
            })
            .catch((error) => {
                console.error('Erro ao enviar dados para a API:', error);
                alert('Erro ao cadastrar excursão. Tente novamente.');
            });
    }

    excursionForm.addEventListener('submit', submitFormData);
});