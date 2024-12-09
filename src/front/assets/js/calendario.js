// Variáveis globais para controlar o mês e o ano
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let diaSelecionado = null;
const email = localStorage.getItem('userEmail');
let roteiros = JSON.parse(localStorage.getItem('roteiros')) || [];
const tipoUsuario = sessionStorage.getItem("userType");

// Função para gerar o calendário
function gerarCalendario() {
    const diasContainer = document.getElementById("dias");
    const mes = document.getElementById("mes");

    mes.textContent = new Date(anoAtual, mesAtual).toLocaleString('pt-BR', { month: 'long' });
    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate(); 

    // Cria a estrutura de dias no calendário
    let diasHtml = '';
    let dia = 1;

    for (let i = 0; i < 6; i++) {
        diasHtml += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < primeiroDia) {
                diasHtml += '<td></td>';
            } else if (dia > diasNoMes) {
                break;
            } else {
                diasHtml += `<td class="dia" data-dia="${dia}" onclick="selecionarDia(${dia})">${dia}</td>`;
                dia++;
            }
        }
        diasHtml += '</tr>';
        if (dia > diasNoMes) break;
    }

    diasContainer.innerHTML = diasHtml;
}

// Função para ir para o próximo mês
function proximoMes() {
    mesAtual++;
    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    gerarCalendario();
}

// Função para ir para o mês anterior
function mesAnterior() {
    mesAtual--;
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }
    gerarCalendario();
}

// Função para selecionar um dia e abrir o modal
function selecionarDia(dia) {
    diaSelecionado = dia;
    const modal = document.getElementById("modal");
    const tituloModal = document.getElementById("modal-titulo");
    const inputDataInicio = document.getElementById("eventStartDate");
    const inputDataFim = document.getElementById("eventEndDate");
    const inputTitulo = document.getElementById("eventTitle");
    const inputLocal = document.getElementById("eventLocation");

    // Atualiza o título do modal para mostrar o dia selecionado
    tituloModal.textContent = `Cadastrar Evento para o dia ${dia} de ${new Date(anoAtual, mesAtual).toLocaleString('pt-BR', { month: 'long' })}`;

    const dataInicio = new Date(anoAtual, mesAtual, dia);
    const dataInicioFormatada = dataInicio.toISOString().split('T')[0];
    inputDataInicio.value = dataInicioFormatada;

    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + 1);
    const dataFimFormatada = dataFim.toISOString().split('T')[0];
    inputDataFim.value = dataFimFormatada;

    inputTitulo.value = '';
    inputLocal.value = '';

    modal.style.display = "block";
}

function fecharModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

function fecharModalUpdate() {
    const modalUpdate = document.getElementById("modal-update");
    modalUpdate.style.display = "none";
}

function salvarRoteiroNoLocalStorage(roteiro) {
    roteiros.push(roteiro);
    localStorage.setItem('roteiros', JSON.stringify(roteiros));
}

// Função para salvar um evento
async function salvarEvento() {
    const inputTitulo = document.getElementById("eventTitle").value;
    const inputDataInicio = document.getElementById("eventStartDate").value;
    const inputDataFim = document.getElementById("eventEndDate").value;
    const inputLocal = document.getElementById("eventLocation").value;

    if (!inputTitulo || !inputDataInicio || !inputDataFim || !inputLocal) {
        exibirMensagem("Erro", "Por favor, preencha todos os campos.", "error");
        return;
    }

    const evento = {
        id: Date.now(),
        titulo: inputTitulo,
        local: inputLocal,
        dataInicio: inputDataInicio,
        dataFim: inputDataFim,
        agenciaEmail: email,
        atividades: []
    };

    try {
        const response = await fetch('http://localhost:8081/api/roteiro/criarRoteiro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evento)
        });

        if (response.ok) {
            const novoRoteiro = await response.json();
            roteiros.push(novoRoteiro);
            localStorage.setItem('roteiros', JSON.stringify(roteiros));

            exibirMensagem("Sucesso", "Evento criado com sucesso!", "success");
            fecharModal(document.getElementById("modal"));
            listarRoteiros();
        } else {
            exibirMensagem("Erro", "Erro ao criar evento.", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        exibirMensagem("Erro", "Erro inesperado ao tentar criar o evento.", "error");
    }
}


// Função para listar todos os roteiros
async function listarRoteiros() {
    try {
        const response = await fetch('http://localhost:8081/api/roteiro/listRoteiros', {
            method: 'GET',
        });

        if (response.ok) {
            roteiros = await response.json();
            localStorage.setItem('roteiros', JSON.stringify(roteiros));

            const listaRoteiros = document.getElementById("event-items");
            listaRoteiros.innerHTML = '';

            roteiros.forEach(roteiro => {
                const item = document.createElement('li');
                item.innerHTML = `
                    <strong>${roteiro.titulo}</strong><br>
                    Local: ${roteiro.local} <br>
                    Início: ${roteiro.dataInicio} <br>
                    Fim: ${roteiro.dataFim} <br>
                `;

                if (tipoUsuario === 'agencia') {
                    item.innerHTML += `
                        <button onclick="atualizarRoteiro(${roteiro.id})" class="btn btn-warning">Atualizar</button>
                        <button onclick="excluirRoteiro(${roteiro.id})" class="btn btn-danger">Excluir</button>
                    `;
                }

                listaRoteiros.appendChild(item);
            });
        } else {
            exibirMensagem("Erro", "Erro ao listar roteiros.", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        exibirMensagem("Erro", "Erro inesperado ao tentar listar os roteiros.", "error");
    }
}


async function salvarRoteiroAtualizado() {
    const titulo = document.getElementById("eventTitle").value;
    const local = document.getElementById("eventLocation").value;
    const dataInicio = document.getElementById("eventStartDate").value;
    const dataFim = document.getElementById("eventEndDate").value;
    const id = document.getElementById("updateRoteiroId").value;

    if (!titulo || !local || !dataInicio || !dataFim) {
        exibirMensagem("Erro", "Por favor, preencha todos os campos.", "error");
        return;
    }

    const roteiroDto = {
        titulo: titulo,
        local: local,
        dataInicio: dataInicio,
        dataFim: dataFim,
    };

    try {
        const response = await fetch(`http://localhost:8081/api/roteiro/updateRoteiro/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roteiroDto),
        });

        if (response.ok) {
            exibirMensagem("Sucesso", "Roteiro atualizado com sucesso!", "success");
            fecharModalUpdate();
            listarRoteiros();
        } else {
            const errorData = await response.json();
            exibirMensagem("Erro", errorData.message || "Erro ao atualizar o roteiro.", "error");
        }
    } catch (error) {
        console.error("Erro ao atualizar roteiro:", error);
        exibirMensagem("Erro", "Erro inesperado ao tentar atualizar o roteiro.", "error");
    }
}

// Função para excluir um roteiro
async function excluirRoteiro(id) {
    try {
        const response = await fetch(`http://localhost:8081/api/roteiro/deleteRoteiro/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            exibirMensagem("Sucesso", "Roteiro excluído com sucesso!", "success");
            listarRoteiros();
        } else {
            exibirMensagem("Erro", "Erro ao excluir roteiro.", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        exibirMensagem("Erro", "Erro inesperado ao tentar excluir o roteiro.", "error");
    }
}

// Função para exibir mensagens de sucesso ou erro
function exibirMensagem(titulo, mensagem, tipo) {
    const tipoClasse = tipo === "success" ? "alert-success" : "alert-danger";

    const div = document.createElement("div");
    div.classList.add("alert", tipoClasse);
    div.innerHTML = `<strong>${titulo}:</strong> ${mensagem}`;

    const alertContainer = document.getElementById("alert-container");

    if (alertContainer) {
        alertContainer.appendChild(div);
        setTimeout(() => {
            div.remove();
        }, 5000);
    }
}
/*
function adicionarAtividade(id) {
    const modal = document.getElementById("activityModal");
    const span = modal.querySelector(".close");
    const activityForm = document.getElementById("activityForm");

    // Abre o modal
    modal.style.display = "block";

    // Fecha o modal ao clicar no botão de fechar
    span.onclick = function () {
        fecharModal(modal);
    };

    // Fecha o modal ao clicar fora do conteúdo
    window.onclick = function (event) {
        if (event.target === modal) {
            fecharModal(modal);
        }
    };

    // Submissão do formulário dentro do modal
    activityForm.onsubmit = function (e) {
        e.preventDefault();

        // Captura os dados do formulário
        const atividadeDescricao = document.getElementById("activityDescription").value.trim();
        const atividadeInicio = document.getElementById("activityStart").value.trim();
        const atividadeFim = document.getElementById("activityEnd").value.trim();
        const atividadeEndereco = document.getElementById("activityAddress").value.trim();

        // Validação
        if (!atividadeDescricao || !atividadeInicio || !atividadeFim || !atividadeEndereco) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        // Localiza o roteiro pelo ID e adiciona a atividade
        const roteiro = roteiros.find(r => r.id === id);
        if (roteiro) {
            const atividade = {
                descricao: atividadeDescricao,
                inicio: atividadeInicio,
                fim: atividadeFim,
                endereco: atividadeEndereco
            };

            roteiro.atividades.push(atividade);
            localStorage.setItem('roteiros', JSON.stringify(roteiros));
            alert("Atividade adicionada com sucesso!");

            // Fecha o modal após salvar
            fecharModal(modal);

            // Limpa o formulário
            activityForm.reset();
        } else {
            alert("Roteiro não encontrado!");
        }
    };
}

// Função para fechar o modal
function fecharModal(modal) {
    modal.style.display = "none";
}
*/

function ajustarInterface() {
    if (tipoUsuario === "cliente") {
        const calendario = document.querySelector(".calendario");
            calendario.style.display = "none";
    }

}


// Função para adicionar eventos aos botões
function configurarEventos() {
    const btnNext = document.getElementById("btn-next");
    const btnPrev = document.getElementById("btn-prev");

    btnNext.addEventListener("click", proximoMes);
    btnPrev.addEventListener("click", mesAnterior);

    listarRoteiros();
    ajustarInterface();
    gerarCalendario();
}

window.onload = configurarEventos;
