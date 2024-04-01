function submitDeleteForm() {
    var maintenanceId = document.getElementById("IdToDelete").value;
    console.log("DELETE");
    if (confirm("Вы уверены, что хотите удалить запись обслуживания с ID " + maintenanceId + "?")) {
        fetch('/maintenance/' + maintenanceId + '/delete', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                var row = document.querySelector('tr[data-id="' + maintenanceId + '"]');
                if (row) {
                    row.remove();
                }
                alert("Запись обслуживания успешно удалена.");
            } else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
                return;
            } else {
                alert("Ошибка при удалении записи обслуживания.");
                return;
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении записи обслуживания:', error);
            alert("Ошибка при удалении записи обслуживания: " + error.message);
            return;
        });
    }
}


function submitEditForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEdit").value;
    var id_seat = document.getElementById('edit_idSeat').value;
    var id_equipment = document.getElementById('edit_idEquipment').value;
    var installation_date = document.getElementById('edit_installationDate').value;
    var removal_date = document.getElementById('edit_removalDate').value;

    // Проверка формата даты
    if (checkDataFormat(installation_date) === 0 || checkDataFormat(removal_date) === 0) {
        alert("Неверный формат даты. Пожалуйста, введите дату в правильном формате.");
        return;
    }

    var maintenance = {
        id: id,
        id_seat: id_seat,
        id_equipment: id_equipment,
        installation_date: installation_date,
        removal_date: removal_date
    };

    var jsonData = JSON.stringify(maintenance);

    fetch('/maintenance/' + id + '/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            updateTableRow(id, maintenance);
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
        alert("Ошибка при редактировании записи обслуживания: " + error.message);
        return;
    });
}


function submitCreateForm(event) {
    event.preventDefault();

    var id_seat = document.getElementById('create_idSeat').value;
    var id_equipment = document.getElementById('create_idEquipment').value;
    var installation_date = document.getElementById('create_installationDate').value;
    var removal_date = document.getElementById('create_removalDate').value;

    // Проверка формата даты
    if (checkDataFormat(installation_date) === 0 || checkDataFormat(removal_date) === 0) {
        alert("Неверный формат даты. Пожалуйста, введите дату в правильном формате.");
        return;
    }
    var maintenance = {
        id_seat: id_seat,
        id_equipment: id_equipment,
        installation_date: installation_date,
        removal_date: removal_date
    };

    var jsonData = JSON.stringify(maintenance);

    fetch('/maintenance/create', {
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
        if (id) { // Проверяем, что id действительно получен
            maintenance.id = id;
            addRowToTable(maintenance);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании записи обслуживания: " + error.message);
        return;
    });
}

function addRowToTable(maintenance) {

    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(0);

    var cellId = newRow.insertCell(0);
    var cellIdSeat = newRow.insertCell(1);
    var cellIdEquipment = newRow.insertCell(2);
    var cellInstallationDate = newRow.insertCell(3);
    var cellRemovalDate = newRow.insertCell(4);
    newRow.setAttribute('data-id', maintenance.id);

    cellId.textContent = maintenance.id
    cellIdSeat.textContent = maintenance.id_seat;
    cellIdEquipment.textContent = maintenance.id_equipment;
    cellInstallationDate.textContent = maintenance.installation_date;
    cellRemovalDate.textContent = maintenance.removal_date;
}

function updateTableRow(rowId, maintenance) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = maintenance.id_seat;
        row.cells[2].textContent = maintenance.id_equipment;
        row.cells[3].textContent = maintenance.installation_date;
        row.cells[4].textContent = maintenance.removal_date;
    }
}