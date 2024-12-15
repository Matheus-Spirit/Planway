document.addEventListener("DOMContentLoaded", function () {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        alert("Erro: Usuário não encontrado.");
        return;
    }

    // Função para buscar os detalhes da venda no localStorage
    function getVendaDetails(email) {
        const vendas = JSON.parse(localStorage.getItem("vendas")) || [];
        const venda = vendas.find((v) => v.emailUsuario === email);

        if (venda) {
            console.log("Detalhes da venda:", venda);
            const valor = venda.valor ? `R$ ${venda.valor.toFixed(2).replace('.', ',')}` : "Valor não disponível";
            displayVendaDetails(venda, valor);
        } else {
            alert("Venda não encontrada.");
        }
    }

    // Exibir os detalhes da venda no HTML
    function displayVendaDetails(venda, valor) {
        document.getElementById("vendaTitle").textContent = venda.nomeExcursao || "Excursão não encontrada";
        document.getElementById("excursionPrice").textContent = valor;
    }

    // Função para remover o participante das excursões no localStorage
    function removeParticipantFromLocalStorage(email) {
        const storedExcursions = JSON.parse(localStorage.getItem("excursoes")) || [];

        storedExcursions.forEach((excursion) => {
            if (excursion.participantes && Array.isArray(excursion.participantes)) {
                const initialCount = excursion.participantes.length;
                excursion.participantes = excursion.participantes.filter((participant) => participant !== email);

                if (excursion.participantes.length !== initialCount) {
                    console.log(`Participante ${email} removido da excursão com ID ${excursion.id}.`);
                }
            }
        });

        // Atualiza o localStorage com as alterações
        localStorage.setItem("excursoes", JSON.stringify(storedExcursions));
        console.log(`Participante ${email} removido das excursões no localStorage.`);
    }

    // Função para remover a venda do localStorage
    function removeVendaFromLocalStorage(email) {
        let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
        const initialLength = vendas.length;

        // Filtra a venda pelo email
        vendas = vendas.filter((venda) => venda.emailUsuario !== email);

        if (vendas.length !== initialLength) {
            console.log(`Venda do usuário ${email} removida.`);
            localStorage.setItem("vendas", JSON.stringify(vendas));
            alert("Venda deletada com sucesso!");
        } else {
            alert("Nenhuma venda encontrada para deletar.");
        }
    }

    // Evento de logout que remove o participante e a venda localmente
    document.getElementById("logoutButton").addEventListener("click", function () {
        removeParticipantFromLocalStorage(userEmail);
        removeVendaFromLocalStorage(userEmail);

        // Redireciona para a página inicial
        window.location.href = "home.html";
    });

    // Carregar os detalhes da venda do usuário
    getVendaDetails(userEmail);
});
