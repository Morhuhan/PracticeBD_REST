function submitDeleteForm() {
    var equipmentId = document.getElementById("IdToDelete").value;

    var totalItems = parseInt(document.getElementById('equipmentCount').getAttribute('data-count'), 10);
    var itemsPerPage = parseInt(document.getElementById('equipmentCountOnPage').getAttribute('data-count-on-page'), 10);

    console.log("DELETE");
    if (confirm("Вы уверены, что хотите удалить оборудование с ID " + equipmentId + "?")) {
        fetch('/equipment/' + equipmentId + '/delete', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                var row = document.querySelector('tr[data-id="' + equipmentId + '"]');
                if (row) {
                    row.remove();
                }

                // Получаем DOM-элемент, который содержит атрибут 'data-count'
                var totalItemsElement = document.getElementById('equipmentCount');

                totalItems--;

                // Обновляем атрибут 'data-count' с новым количеством элементов
                totalItemsElement.setAttribute('data-count', totalItems.toString());

                alert("Оборудование успешно удалено.");
            } else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
                return;
            } else {
                alert("Ошибка при удалении оборудования.");
                return;
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении оборудования:', error);
            alert("Ошибка при удалении оборудования: " + error.message);
            return;
        });
    }
}

function submitEditForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEdit").value;
    var id_equipmentType = document.getElementById('edit_idEquipmentType').value;
    var inv_number = document.getElementById('edit_invNumber').value;
    var p_i = document.getElementById('edit_pI').value;
    var note = document.getElementById('edit_note').value;

    var equipment = {
        id: id,
        id_equipmentType: id_equipmentType,
        inv_number: inv_number,
        p_i: p_i,
        note: note
    };

    var jsonData = JSON.stringify(equipment);

    fetch('/equipment/' + id + '/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            updateTableRow(id, equipment);
        } else if (response.status === 500) {
            response.text().then(errorMessage => {
                alert("Ошибка сервера: " + errorMessage);
            });
            return;
        } else {
            throw new Error('Network response was not ok');
            return;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при редактировании оборудования: " + error.message);
        return;
    });
}

function submitCreateForm(event) {
    event.preventDefault();

    var id_equipmentType = document.getElementById('create_idEquipmentType').value;
    var inv_number = document.getElementById('create_invNumber').value;
    var p_i = document.getElementById('create_pI').value;
    var note = document.getElementById('create_note').value;

    var totalItems = parseInt(document.getElementById('equipmentCount').getAttribute('data-count'), 10);
    var itemsPerPage = parseInt(document.getElementById('equipmentCountOnPage').getAttribute('data-count-on-page'), 10);

    var equipment = {
        id_equipmentType: id_equipmentType,
        inv_number: inv_number,
        p_i: p_i,
        note: note
    };

    var jsonData = JSON.stringify(equipment);

    fetch('/equipment/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 500) {
            response.text().then(errorMessage => {
                alert("Ошибка сервера: " + errorMessage);
            });
            return;
        } else {
            throw new Error('Network response was not ok');
            return;
        }
    })
    .then(id => {
        if (id) {
            equipment.id = id;

            // Получаем DOM-элемент, который содержит атрибут 'data-count'
            var equipmentCountElement = document.getElementById('equipmentCount');

            // Увеличиваем totalItems на 1
            totalItems++;

            // Обновляем атрибут 'data-count' с новым количеством элементов
            equipmentCountElement.setAttribute('data-count', totalItems.toString());

            if (totalItems <= itemsPerPage) {
                addRowToTable(equipment);
            } else {
                updatePaginationPanelToCreate(); // Обновляем панель навигации
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании оборудования: " + error.message);
        return;
    });
}

function addRowToTable(equipment) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(-1);

    var cellId = newRow.insertCell(0);
    var cellIdEquipmentType = newRow.insertCell(1);
    var cellInvNumber = newRow.insertCell(2);
    var cellPI = newRow.insertCell(3);
    var cellNote = newRow.insertCell(4);
    newRow.setAttribute('data-id', equipment.id);

    cellId.textContent = equipment.id;
    cellIdEquipmentType.textContent = equipment.id_equipmentType;
    cellInvNumber.textContent = equipment.inv_number;
    cellPI.textContent = equipment.p_i;
    cellNote.textContent = equipment.note;
}


function updatePaginationPanelToCreate() {
    var totalItems = parseInt(document.getElementById('equipmentCount').getAttribute('data-count'), 10);
    var itemsPerPage = parseInt(document.getElementById('equipmentCountOnPage').getAttribute('data-count-on-page'), 10);
    var paginationPanel = document.getElementById('paginationPanel');

    // Очищаем текущую панель навигации
    paginationPanel.innerHTML = '';

    // Вычисляем новое количество страниц
    var pageCount = Math.ceil(totalItems / itemsPerPage);

    // Создаем кнопки для каждой страницы
    for (let i = 1; i <= pageCount; i++) {
        var button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', function() {
            fetchNextEquipmentPage(i, itemsPerPage);
        });
        paginationPanel.appendChild(button);
    }
}

function updateTableRow(rowId, equipment) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = equipment.id_equipmentType;
        row.cells[2].textContent = equipment.inv_number;
        row.cells[3].textContent = equipment.p_i;
        row.cells[4].textContent = equipment.note;
    }
}


document.addEventListener('DOMContentLoaded', function() {

    var totalItems = parseInt(document.getElementById('equipmentCount').getAttribute('data-count'), 10);
    var itemsPerPage = parseInt(document.getElementById('equipmentCountOnPage').getAttribute('data-count-on-page'), 10);
    var paginationPanel = document.getElementById('paginationPanel');

    // Вычисляем количество страниц
    var pageCount = Math.ceil(totalItems / itemsPerPage);

    // Создаем кнопки для каждой страницы
    for (let i = 1; i <= pageCount; i++) {
        var button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', function() {
            fetchNextEquipmentPage(i, itemsPerPage);
        });
        paginationPanel.appendChild(button);
    }
});

function fetchNextEquipmentPage(pageNumber, itemsPerPage) {
    // Создаем объект с данными для отправки
    var requestData = {
        page: pageNumber,
        itemsPerPage: itemsPerPage
    };

    // Отправляем запрос на сервер
    fetch('/equipment/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData) // Преобразуем данные в строку JSON
    })
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                // Обновляем таблицу данными, полученными с сервера
                updateTableWithNewData(data);
            });
        } else {
            alert("Ошибка при получении данных оборудования.");
        }
    })
    .catch(error => {
        console.error('Ошибка при получении данных оборудования:', error);
        alert("Ошибка при получении данных оборудования: " + error.message);
    });
}

function updateTableWithNewData(data) {
    var tableBody = document.querySelector('#table tbody[data-table-type="equipment"]');
    tableBody.innerHTML = ''; // Очищаем текущее содержимое tbody

    // Проходимся по каждому элементу массива данных, полученных с сервера
    data.forEach(function(equipment) {
        // Создаем строку таблицы
        var row = document.createElement('tr');
        row.setAttribute('data-id', equipment.id);

        // Создаем и заполняем ячейки для каждого поля оборудования
        var idCell = document.createElement('td');
        idCell.textContent = equipment.id;
        row.appendChild(idCell);

        var typeIdCell = document.createElement('td');
        typeIdCell.textContent = equipment.id_equipmentType;
        row.appendChild(typeIdCell);

        var invNumberCell = document.createElement('td');
        invNumberCell.textContent = equipment.inv_number;
        row.appendChild(invNumberCell);

        var piCell = document.createElement('td');
        piCell.textContent = equipment.p_i;
        row.appendChild(piCell);

        var noteCell = document.createElement('td');
        noteCell.textContent = equipment.note;
        row.appendChild(noteCell);

        // Добавляем строку в tbody
        tableBody.appendChild(row);
    });
}
