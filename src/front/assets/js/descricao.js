document.addEventListener("DOMContentLoaded", function () {
    let excursionId;
    let userEmail = localStorage.getItem("userEmail") || "Usuário não identificado";

    // Função para carregar os detalhes da excursão
    function loadExcursionDetails() {
        const excursions = JSON.parse(localStorage.getItem("excursions"));
        const urlParams = new URLSearchParams(window.location.search);
        excursionId = urlParams.get("id");

        if (!excursionId) {
            alert("ID da excursão não fornecido.");
            window.location.href = "pesquisa.html";
            return;
        }

        if (!excursions || excursions.length === 0) {
            alert("Nenhuma excursão encontrada no localStorage.");
            window.location.href = "pesquisa.html";
            return;
        }

        const excursion = excursions.find(e => e.id === parseInt(excursionId, 10));

        if (excursion) {
            document.getElementById("title").textContent = excursion.nome;
            document.getElementById("description").textContent = excursion.descricao;
            document.getElementById("startDate").textContent = `Início: ${formatDate(excursion.dataInicio)}`;
            document.getElementById("endDate").textContent = `Fim: ${formatDate(excursion.dataFim)}`;
            document.getElementById("location").textContent = `Local: ${excursion.local}`;
            document.getElementById("price").textContent = `Preço: R$ ${excursion.valor.toFixed(2).replace('.', ',')}`;

            displayComments(excursion);
            displayAverageRating(excursion);
        } else {
            alert("Excursão não encontrada.");
            window.location.href = "pesquisa.html";
        }
    }

    // Função para exibir comentários
    function displayComments(excursion) {
        const commentsList = document.getElementById("commentsList");
        commentsList.innerHTML = '';

        if (excursion.comentarios && excursion.comentarios.length > 0) {
            excursion.comentarios.forEach(comment => {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item";
                listItem.textContent = `${comment.email}: ${comment.texto}`;
                commentsList.appendChild(listItem);
            });
        } else {
            const noCommentsMessage = document.createElement("li");
            noCommentsMessage.className = "list-group-item";
            noCommentsMessage.textContent = "Nenhum comentário ainda.";
            commentsList.appendChild(noCommentsMessage);
        }
    }

    // Função para exibir a média de avaliação
    function displayAverageRating(excursion) {
        const averageRating = excursion.avaliacoes && excursion.avaliacoes.length > 0 ?
            excursion.avaliacoes.reduce((sum, rating) => sum + rating, 0) / excursion.avaliacoes.length : 0;

        const averageRatingText = `Média de avaliação: ${averageRating.toFixed(1)} estrelas`;
        document.getElementById("averageRating").textContent = averageRatingText;
    }

    // Função para formatar datas no formato dd/mm/yyyy
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Enviar comentário
    document.getElementById("submitComment").addEventListener("click", function () {
        const commentText = document.getElementById("commentText").value;
        const rating = document.getElementById("rating").value;

        if (!commentText.trim()) {
            alert("Comentário não pode ser vazio.");
            return;
        }

        const newComment = {
            email: userEmail,
            texto: commentText,
            avaliacao: parseInt(rating, 10)
        };

        const excursions = JSON.parse(localStorage.getItem("excursions"));
        const excursion = excursions.find(e => e.id === parseInt(excursionId, 10));

        if (excursion) {
            if (!excursion.comentarios) {
                excursion.comentarios = [];
            }
            excursion.comentarios.push(newComment);

            if (!excursion.avaliacoes) {
                excursion.avaliacoes = [];
            }
            excursion.avaliacoes.push(newComment.avaliacao);

            // Atualizar os dados no localStorage
            localStorage.setItem("excursions", JSON.stringify(excursions));

            // Atualizar a tela
            displayComments(excursion);
            displayAverageRating(excursion);

            // Limpar o campo de comentário
            document.getElementById("commentText").value = '';
            alert("Comentário enviado com sucesso!");
        }
    });

    loadExcursionDetails();
});