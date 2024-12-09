document.addEventListener("DOMContentLoaded", function () {
    const excursionId = new URLSearchParams(window.location.search).get('id');
    const userEmail = localStorage.getItem("userEmail");

    if (!excursionId || !userEmail) {
        alert("Erro: Dados da excursão ou usuário não encontrados.");
        return;
    }

    // Função para buscar os detalhes da excursão
    async function getExcursionDetails(id) {
        try {
            const response = await fetch(`http://localhost:8081/api/excursoes/listExcursao/${id}`);
            if (!response.ok) {
                throw new Error("Não foi possível carregar os detalhes da excursão.");
            }
            const excursion = await response.json();
            console.log(excursion);
            displayExcursionDetails(excursion);
            saveExcursionToLocalStorage(excursion); 
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar os detalhes da excursão.");
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
        window.excursionData = excursion;
    }

    // Função para salvar a excursão no localStorage
    function saveExcursionToLocalStorage(excursion) {
        const excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];
        const existingExcursion = excursoes.find(e => e.id === excursion.id);
    
        if (!existingExcursion) {
            excursion.participantes = excursion.participantes || []; 
            if (excursion.participantes.length >= excursion.quantidadePessoas) {
                alert("Número máximo de participantes atingido para esta excursão.");
                return;
            }
            excursoes.push(excursion);
            localStorage.setItem("excursoes", JSON.stringify(excursoes));
            console.log("Excursão salva no localStorage:", excursion);
        }
    }
    
    

    // Função para adicionar um participante localmente
    function addParticipantToExcursion(excursionId, userEmail) {
        const excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];
        const excursion = excursoes.find(e => e.id == excursionId);
    
        if (excursion) {
            excursion.participantes = excursion.participantes || [];
            if (excursion.participantes.length >= excursion.quantidadePessoas) {
                alert("Número máximo de participantes atingido para esta excursão.");
                return;
            }
    
            const participantExists = excursion.participantes.some(p => p === userEmail);
    
            if (!participantExists) {
                excursion.participantes.push(userEmail);
                localStorage.setItem("excursoes", JSON.stringify(excursoes));
                console.log(`Participante ${userEmail} adicionado à excursão ${excursionId}`);
                alert("Você foi adicionado à excursão com sucesso!");
            } else {
                alert("Você já está participando desta excursão.");
            }
        } else {
            console.error("Excursão não encontrada no localStorage para adicionar participante:", excursionId);
        }
    } 

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Função para realizar a venda
    async function realizarVenda(excursionData, userEmail) {
        try {
            const excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];
            const excursion = excursoes.find(e => e.id === excursionData.id);
    
            if (!excursion) {
                alert("Erro: Excursão não encontrada.");
                return;
            }
    
            excursion.participantes = excursion.participantes || []; // Inicializa se estiver undefined
    
            if (excursion.participantes.length >= excursion.quantidadePessoas) {
                alert("Não é possível realizar a venda. A excursão já atingiu o número máximo de participantes.");
                return;
            }
    
            const venda = {
                valor: excursionData.valor,
                emailUsuario: userEmail,
                nomeExcursao: excursionData.nome,
                localExcursao: excursionData.local,
            };
    
            const response = await fetch('http://localhost:8081/api/vendas/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(venda),
            });
    
            if (!response.ok) {
                throw new Error("Erro ao realizar a venda.");
            }
    
            const result = await response.json();
            addParticipantToExcursion(excursionData.id, userEmail);
            alert("Venda realizada com sucesso!");
            console.log(result);
        } catch (error) {
            console.error(error);
            alert("Erro ao realizar a venda.");
        }
    }

    document.getElementById('participateButton').addEventListener('click', function () {
        $('#confirmModal').modal('show');
    });

    document.getElementById('confirmParticipateButton').addEventListener('click', function () {
        $('#confirmModal').modal('hide'); 
        realizarVenda(window.excursionData, userEmail);
    });

    getExcursionDetails(excursionId);
});