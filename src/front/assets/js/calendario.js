document.addEventListener('DOMContentLoaded', function() {
    const monthBR = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const tableDays = document.getElementById('dias');
    const eventList = document.getElementById('event-items');
    let events = JSON.parse(localStorage.getItem('events')) || [];

    

    let startDate = new Date();
    let endDate = new Date(startDate);

    function GetDaysCalendar(mes, ano) {
        document.getElementById('mes').innerHTML = monthBR[mes];
        document.getElementById('ano').innerHTML = ano;

        let firstDayOfWeek = new Date(ano, mes, 1).getDay();
        let getLastDayThisMonth = new Date(ano, mes + 1, 0).getDate();

        for (let i = 1 - firstDayOfWeek, index = 0; i <= (42 - firstDayOfWeek); i++, index++) {
            let dt = new Date(ano, mes, i);
            let dtNow = new Date();
            let dayTable = tableDays.getElementsByTagName('td')[index];
            dayTable.classList.remove('mes-anterior', 'proximo-mes', 'dia-atual', 'event');
            dayTable.innerHTML = dt.getDate();

            if (dt.getFullYear() === dtNow.getFullYear() &&
                dt.getMonth() === dtNow.getMonth() &&
                dt.getDate() === dtNow.getDate()) {
                dayTable.classList.add('dia-atual');
            }

            if (dt.getMonth() < mes) {
                dayTable.classList.add('mes-anterior');
            }
            if (dt.getMonth() > mes) {
                dayTable.classList.add('proximo-mes');
            }

            dayTable.onclick = function() {
                openModal(dt);
            };

            events.forEach(event => {
                if (new Date(event.startDate).toDateString() === dt.toDateString()) {
                    dayTable.classList.add('event');
                    dayTable.setAttribute('title', event.title);
                }
            });
        }
    }

    //Função que abre a jenela de criação de roteiro
    function openModal(date) {
        const modal = document.getElementById('modal');
        const span = document.getElementsByClassName('close')[0];
        const eventForm = document.getElementById('eventForm');
        const eventTitleInput = document.getElementById('eventTitle');
        const eventStartDateInput = document.getElementById('eventStartDate');
        const eventEndDateInput = document.getElementById('eventEndDate');
        const eventLocationInput = document.getElementById('eventLocation');

        eventStartDateInput.value = date.toISOString().split('T')[0];
        eventEndDateInput.value = date.toISOString().split('T')[0];

        modal.style.display = 'block';

        span.onclick = function() {
            modal.style.display = 'none';
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };

        eventForm.onsubmit = function(e) {
            e.preventDefault();
        
            const eventTitle = eventTitleInput.value.trim();
            const eventStartDate = new Date(eventStartDateInput.value + 'T00:00:00'); // Garanta que a data seja no início do dia
            const eventEndDate = new Date(eventEndDateInput.value + 'T00:00:00');
            const eventLocation = eventLocationInput.value.trim();
        
            // Validação
            if (!eventTitle) {
                alert("Por favor, insira um título para o evento.");
                return;
            }
            if (isNaN(eventStartDate.getTime()) || isNaN(eventEndDate.getTime())) {
                alert("Por favor, insira datas válidas.");
                return;
            }
            if (eventStartDate >= eventEndDate) {
                alert("A data de início deve ser anterior à data de término.");
                return;
            }
        
            saveEvent(eventStartDate, eventEndDate, eventLocation, eventTitle);
            modal.style.display = 'none';
        };
    }
    
    //função de salvar os roteiros
    function saveEvent(startDate, endDate, location, title) {
        const newEvent = {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            location: location,
            title: title,
            activities: []
        };

        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        GetDaysCalendar(startDate.getMonth(), startDate.getFullYear());
        displayEvents();
        sendNotification(newEvent);
    }

    function sendNotification(event) {
        alert(`Notificação: Evento criado de ${event.startDate} a ${event.endDate} no local ${event.location}.`);
    }

    //função que cria a lista ao lado do calendario
    function displayEvents() {
        eventList.innerHTML = '';
        events.forEach((event, index) => {
            let li = document.createElement('li');
            li.innerHTML = `Data: ${event.startDate} a ${event.endDate}, Título: ${event.title}, Local: ${event.location}
                            <button onclick="editEvent(${index})" class="btn btn-outline-primary">Editar</button>
                            <button onclick="deleteEvent(${index})" class="btn btn-outline-danger">Excluir</button>
                            <button onclick="openActivityModal(${index})" class="btn btn-outline-secondary">Adicionar Atividade</button>`;
            
            // Adicionar lista de atividades
            if (event.activities.length > 0) {
                const activityList = document.createElement('ul');
                event.activities.forEach((activity, activityIndex) => {
                    let activityItem = document.createElement('li');
                    activityItem.innerHTML = `Atividade: ${activity.description}, Início: ${activity.start}, Fim: ${activity.end}, Endereço: ${activity.address}
                        <button onclick="editActivity(${index}, ${activityIndex})" class="btn btn-outline-primary">Editar Atividade</button>
                        <button onclick="deleteActivity(${index}, ${activityIndex})" class="btn btn-outline-danger">Excluir Atividade</button>`;

                    activityList.appendChild(activityItem);
                });
                li.appendChild(activityList);
            }
            
            eventList.appendChild(li);
        });
    }

    // Funções de editar o Roteiro 
    window.editEvent = function(index) {
        const event = events[index];
        const modal = document.getElementById('modal');
        const eventForm = document.getElementById('eventForm');
        const eventTitleInput = document.getElementById('eventTitle');
        const eventStartDateInput = document.getElementById('eventStartDate');
        const eventEndDateInput = document.getElementById('eventEndDate');
        const eventLocationInput = document.getElementById('eventLocation');

        eventTitleInput.value = event.title;
        eventStartDateInput.value = event.startDate;
        eventEndDateInput.value = event.endDate;
        eventLocationInput.value = event.location;

        modal.style.display = 'block';

        eventForm.onsubmit = function(e) {
            e.preventDefault();
            events[index].title = eventTitleInput.value;
            events[index].startDate = eventStartDateInput.value;
            events[index].endDate = eventEndDateInput.value;
            events[index].location = eventLocationInput.value;

            localStorage.setItem('events', JSON.stringify(events));
            modal.style.display = 'none';
            displayEvents();
            GetDaysCalendar(new Date(event.startDate).getMonth(), new Date(event.startDate).getFullYear());
        };
    }

    //Função de exclusão de Roteiros
    window.deleteEvent = function(index) {
        events.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents();
        const now = new Date();
        GetDaysCalendar(now.getMonth(), now.getFullYear());
    }

    let now = new Date();
    let mes = now.getMonth();
    let ano = now.getFullYear();
    GetDaysCalendar(mes, ano);
    displayEvents();

    const botao_proximo = document.getElementById('btn-prev');
    const botao_anterior = document.getElementById('btn-ant');

    botao_proximo.onclick = function() {
        mes++;
        if (mes > 11) {
            mes = 0;
            ano++;
        }
        GetDaysCalendar(mes, ano);
    };

    botao_anterior.onclick = function() {
        mes--;
        if (mes < 0) {
            mes = 11;
            ano--;
        }
        GetDaysCalendar(mes, ano);
    };

    //essa função abre a janela de criação de Atividades
    window.openActivityModal = function openActivityModal(eventIndex) {
        const modal = document.getElementById('activityModal');
        const span = document.getElementsByClassName('close')[1];
        const activityForm = document.getElementById('activityForm');
        const activityStartInput = document.getElementById('activityStart');
        const activityEndInput = document.getElementById('activityEnd');
        const activityDescriptionInput = document.getElementById('activityDescription');
        const activityAddressInput = document.getElementById('activityAddress');
    
        modal.style.display = 'block'; // Exibir o modal
    

        span.onclick = function() {
            modal.style.display = 'none'; // Fechar modal ao clicar no "X"
        };
    
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none'; // Fechar ao clicar fora do modal
            }
        };
    
        activityForm.onsubmit = function(e) {
            e.preventDefault();
            const activityStart = activityStartInput.value;
            const activityEnd = activityEndInput.value;
            const activityDescription = activityDescriptionInput.value;
            const activityAddress = activityAddressInput.value;
    
            addActivity(eventIndex, activityStart, activityEnd, activityAddress, activityDescription);
            modal.style.display = 'none'; // Fechar o modal após adicionar a atividade
        };
    }
    
    const eventTitle = document.getElementById('eventTitle');

    const newEvent = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        title: eventTitle,
        activities: []  // Nova lista de atividades
    };

    function addActivity(eventIndex, start, end, address, description) {
        console.log('Adicionando atividade:', { start, end, address, description });
        const newActivity = {
            start: start,
            end: end,
            address: address,
            description: description
        };
        events[eventIndex].activities.push(newActivity);
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents(); // Para atualizar a lista de eventos
    }
    
    // Funções de edição e exclusão de atividades
    window.editActivity = function editActivity(eventIndex, activityIndex) {
        const activity = events[eventIndex].activities[activityIndex];
        const modal = document.getElementById('activityModal');
        const activityForm = document.getElementById('activityForm');
        const activityStartInput = document.getElementById('activityStart');
        const activityEndInput = document.getElementById('activityEnd');
        const activityDescriptionInput = document.getElementById('activityDescription');
        const activityAddressInput = document.getElementById('activityAddress');

        activityStartInput.value = activity.start;
        activityEndInput.value = activity.end;
        activityDescriptionInput.value = activity.description;
        activityAddressInput.value = activity.address;

        modal.style.display = 'block';

        activityForm.onsubmit = function(e) {
            e.preventDefault();
            events[eventIndex].activities[activityIndex] = {
                start: activityStartInput.value,
                end: activityEndInput.value,
                address: activityAddressInput.value,
                description: activityDescriptionInput.value
            };
            localStorage.setItem('events', JSON.stringify(events));
            modal.style.display = 'none';
            displayEvents();
        };
    };

    window.deleteActivity = function deleteActivity(eventIndex, activityIndex) {
        events[eventIndex].activities.splice(activityIndex, 1);
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents();
    };
    
});