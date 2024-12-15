document.addEventListener("DOMContentLoaded", function () {
    const excursionId = new URLSearchParams(window.location.search).get('id');
    const userEmail = localStorage.getItem("userEmail");

    if (!excursionId || !userEmail) {
        alert("Erro: Dados da excursão ou usuário não encontrados.");
        return;
    }

    // Função para buscar os detalhes da excursão do localStorage
    function getExcursionDetailsFromLocalStorage(id) {
        const excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];
        const excursion = excursoes.find(e => e.id == id);

        if (excursion) {
            displayExcursionDetails(excursion);
            saveExcursionToLocalStorage(excursion);
            window.excursionData = excursion;
        } else {
            alert("Excursão não encontrada.");
            window.location.href = "pesquisa.html";
        }
    }

    // Função para mostrar os detalhes da excursão na página
    function displayExcursionDetails(excursion) {
        document.getElementById('title').textContent = excursion.nome;
        document.getElementById('description').textContent = excursion.descricao;
        document.getElementById('startDate').textContent = formatDate(excursion.dataInicio);
        document.getElementById('endDate').textContent = formatDate(excursion.dataFim);
        document.getElementById('location').textContent = excursion.local;
        document.getElementById('price').textContent = `R$ ${excursion.valor.toFixed(2)}`;
        document.getElementById('qtdPessoas').textContent = excursion.quantidadePessoas;
    }

    // Função para salvar a excursão no localStorage
    function saveExcursionToLocalStorage(excursion) {
        const excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];
        if (!excursoes.some(e => e.id === excursion.id)) {
            excursoes.push(excursion);
            localStorage.setItem("excursoes", JSON.stringify(excursoes));
        }
    }

    // Função para adicionar um participante à excursão
    function addParticipantToExcursion(excursionId, userEmail) {
        const excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];
        const excursion = excursoes.find(e => e.id == excursionId);

        if (excursion) {
            excursion.participantes = excursion.participantes || [];
            if (excursion.participantes.length >= excursion.quantidadePessoas) {
                alert("Número máximo de participantes atingido para esta excursão.");
                return;
            }

            if (!excursion.participantes.includes(userEmail)) {
                excursion.participantes.push(userEmail);
                localStorage.setItem("excursoes", JSON.stringify(excursoes));
                alert("Você foi adicionado à excursão com sucesso!");
            } else {
                alert("Você já está participando desta excursão.");
            }
        } else {
            alert("Excursão não encontrada.");
        }
    }

    // Função para realizar a "venda" simulada
    function realizarVenda(excursionData, userEmail) {
        const venda = {
            valor: excursionData.valor,
            emailUsuario: userEmail,
            nomeExcursao: excursionData.nome,
            localExcursao: excursionData.local,
            data: new Date().toLocaleString(),
        };

        // Salva vendas no localStorage
        const vendas = JSON.parse(localStorage.getItem("vendas")) || [];
        vendas.push(venda);
        localStorage.setItem("vendas", JSON.stringify(vendas));

        // Adiciona o participante na excursão
        addParticipantToExcursion(excursionData.id, userEmail);
    }

    // Formata a data para exibição
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Evento para abrir modal de confirmação
    document.getElementById('participateButton').addEventListener('click', function () {
        $('#confirmModal').modal('show');
    });

    // Evento para confirmar participação
    document.getElementById('confirmParticipateButton').addEventListener('click', function () {
        $('#confirmModal').modal('hide');
        realizarVenda(window.excursionData, userEmail);
    });

    // Carrega os detalhes da excursão
    getExcursionDetailsFromLocalStorage(excursionId);
});
