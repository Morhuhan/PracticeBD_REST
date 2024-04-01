function submitDeleteForm() {
    var equipmentId = document.getElementById("IdToDelete").value;
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
            addRowToTable(equipment);
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

    var newRow = tableBody.insertRow(0);

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

function updateTableRow(rowId, equipment) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = equipment.id_equipmentType;
        row.cells[2].textContent = equipment.inv_number;
        row.cells[3].textContent = equipment.p_i;
        row.cells[4].textContent = equipment.note;
    }
}