document.addEventListener("DOMContentLoaded", function () {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        alert("Erro: Usuário não encontrado.");
        return;
    }

    async function getVendaDetails(email) {
        try {
            const response = await fetch(`https://planway-production.up.railway.app/api/vendas/listVenda/${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Venda não encontrada.");
            }

            const venda = await response.json();
            console.log("Detalhes da venda:", venda);

            if (venda && venda.nomeExcursao) {
                const valor = venda.valor ? `R$ ${venda.valor.toFixed(2)}` : "Valor não disponível";
                displayVendaDetails(venda, valor);
            } else {
                alert("Venda não encontrada ou dados incompletos.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar os detalhes da venda.");
        }
    }

    // Exibir os detalhes da venda no HTML
    function displayVendaDetails(venda, valor) {
        document.getElementById("vendaTitle").textContent = venda.nomeExcursao;
        document.getElementById("excursionPrice").textContent = valor;
    }

    // Função para remover o participante específico do localStorage
    function removeParticipantFromLocalStorage(email) {
        const storedExcursions = JSON.parse(localStorage.getItem("excursoes")) || [];

        storedExcursions.forEach((excursion) => {
            if (excursion.participantes && Array.isArray(excursion.participantes)) {
                const initialCount = excursion.participantes.length;
                excursion.participantes = excursion.participantes.filter((participant) => participant !== email);
                if (excursion.participantes.length !== initialCount) {
                    console.log(
                        `Participante ${email} removido da excursão com ID ${excursion.id}.`
                    );
                }
            }
        });

        // Atualiza o localStorage com as alterações
        localStorage.setItem("excursoes", JSON.stringify(storedExcursions));
        console.log(`Participante ${email} removido das excursões no localStorage.`);
    }

    document.getElementById("logoutButton").addEventListener("click", function () {
        removeParticipantFromLocalStorage(userEmail);

        fetch(`https://planway-production.up.railway.app/api/vendas/deleteVenda/${userEmail}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    alert("Venda deletada com sucesso!");
                    window.location.href = "home.html";
                } else {
                    alert("Erro ao deletar a venda. Tente novamente.");
                }
            })
            .catch((error) => {
                console.error("Erro ao tentar deletar a venda:", error);
                alert("Erro ao tentar deletar a venda.");
            });
    });

    getVendaDetails(userEmail);
});
