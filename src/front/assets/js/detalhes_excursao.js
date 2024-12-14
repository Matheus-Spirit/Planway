document.addEventListener("DOMContentLoaded", function () {
    let excursionId;

    // Função para carregar os detalhes da excursão
    function loadExcursionDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        excursionId = urlParams.get("id");
    
        if (!excursionId) {
            alert("ID da excursão não fornecido.");
            window.location.href = "pesquisa.html";
            return;
        }
    
        excursionId = parseInt(excursionId, 10);
    
        if (isNaN(excursionId)) {
            alert("ID da excursão inválido.");
            window.location.href = "pesquisa.html";
            return;
        }
    
        const storedExcursions = JSON.parse(localStorage.getItem("excursoes")) || [];
        let excursion = storedExcursions.find(e => e.id === excursionId);
    
        if (!excursion) {
            const pastExcursions = JSON.parse(localStorage.getItem("excursoesPast")) || [];
            excursion = pastExcursions.find(e => e.id === excursionId);
        }
    
        if (excursion) {
            document.getElementById("title").value = excursion.nome || "Sem título";
            document.getElementById("description").value = excursion.descricao || "Sem descrição";
            document.getElementById("startDate").value = excursion.dataInicio || "";
            document.getElementById("endDate").value = excursion.dataFim || "";
            document.getElementById("location").value = excursion.local || "Local não informado";
            document.getElementById("price").value = excursion.valor || 0;
    
            displayParticipants(excursion.participantes || []);
            displayCommentsAndRatings(excursion.comentarios || []);
            calculateComplaintPercentage(excursion.comentarios || []);
            calculateReservedExcursionsPercentage(excursion);
        } else {
            alert("Excursão não encontrada.");
            window.location.href = "pesquisa.html";
        }
    }
    

    // Função para exibir os participantes da excursão
    function displayParticipants(participants) {
        const participantsList = document.getElementById("participants");
        participantsList.innerHTML = '';

        const participantsCount = participants.length;
        const participantsCountDisplay = document.getElementById("participantsCount");
        participantsCountDisplay.textContent = `Total de participantes: ${participantsCount}`;

        if (participantsCount > 0) {
            participants.forEach(participant => {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item";
                listItem.textContent = participant;
                participantsList.appendChild(listItem);
            });
        } else {
            const noParticipantsMessage = document.createElement("li");
            noParticipantsMessage.className = "list-group-item";
            noParticipantsMessage.textContent = "Nenhum participante registrado ainda.";
            participantsList.appendChild(noParticipantsMessage);
        }
    }

    // Função para exibir comentários e avaliações
    function displayCommentsAndRatings(comments) {
        const commentsContainer = document.getElementById("commentsContainer");
        commentsContainer.innerHTML = '';

        if (comments.length === 0) {
            const noCommentsMessage = document.createElement("div");
            noCommentsMessage.className = "alert alert-secondary";
            noCommentsMessage.textContent = "Nenhum comentário ainda.";
            commentsContainer.appendChild(noCommentsMessage);
            return;
        }

        comments.forEach(comment => {
            const commentBox = document.createElement("div");
            commentBox.className = "card mb-3";

            const ratingColor = comment.avaliacao < 3
                ? "#F07771" // Vermelho
                : comment.avaliacao === 3
                ? "#e2e3e5" // Cinza
                : "#71EF72"; // Verde

            commentBox.style.backgroundColor = ratingColor;

            commentBox.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${"★".repeat(comment.avaliacao)}${"☆".repeat(5 - comment.avaliacao)}</h5>
                    <p class="card-text"><strong>${comment.email}</strong></p>
                    <p class="card-text">${comment.texto}</p>
                </div>
            `;

            commentsContainer.appendChild(commentBox);
        });
    }
    // Função para calcular o percentual de excursões reservadas
    function calculateReservedExcursionsPercentage(excursion) {
        const currentParticipantsCount = excursion.participantes.length;
        const currentCapacity = parseInt(excursion.quantidadePessoas, 10);
        
        const currentPercentage = (currentParticipantsCount / currentCapacity) * 100;

        document.getElementById("currentExcursionPercentage").textContent =
            `Percentual desta excursão reservada: ${currentPercentage.toFixed(2)}% (${currentParticipantsCount}/${currentCapacity})`;
    }


    // Função para calcular e exibir o percentual de reclamações
    function calculateComplaintPercentage(comments) {
        const negativeComments = comments.filter(comment => comment.avaliacao < 3).length;
        const totalComments = comments.length;

        const complaintPercentage = totalComments > 0
            ? (negativeComments / totalComments) * 100
            : 0;

        document.getElementById("complaintCount").textContent = `Total de comentários negativos: ${negativeComments}`;
        document.getElementById("complaintPercentage").textContent =
            `Percentual de reclamações: ${complaintPercentage.toFixed(2)}% (${negativeComments}/${totalComments})`;
    }


    // Função para finalizar a excursão (local e backend)
    document.getElementById("finishExcursionBtn").addEventListener("click", async function () {
        const storedExcursions = JSON.parse(localStorage.getItem("excursoes")) || [];
        const pastExcursions = JSON.parse(localStorage.getItem("excursoesPast")) || [];

        const excursionIndex = storedExcursions.findIndex(e => e.id === excursionId);

        if (excursionIndex !== -1) {
            const [finishedExcursion] = storedExcursions.splice(excursionIndex, 1);
            pastExcursions.push(finishedExcursion);

            localStorage.setItem("excursoes", JSON.stringify(storedExcursions));
            localStorage.setItem("excursoesPast", JSON.stringify(pastExcursions));

            try {
                const response = await fetch(`https://planway-production.up.railway.app/api/excursoes/delete/${excursionId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert("Excursão finalizada e removida com sucesso!");
                    window.location.href = "pesquisa.html";
                } else {
                    throw new Error("Erro ao remover a excursão do backend.");
                }
            } catch (error) {
                console.error("Erro ao remover a excursão do backend:", error);
                alert("Excursão finalizada localmente, mas ocorreu um erro ao removê-la do backend.");
            }
        } else {
            alert("Excursão não encontrada na lista atual.");
        }
    });

    loadExcursionDetails();
});
