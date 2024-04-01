function submitDeleteForm() {
    var equipmentTypeId = document.getElementById("IdToDelete").value;
    console.log("DELETE");
    if (confirm("Вы уверены, что хотите удалить тип оборудования с ID " + equipmentTypeId + "?")) {
        fetch('/equipmentType/' + equipmentTypeId + '/delete', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                var row = document.querySelector('tr[data-id="' + equipmentTypeId + '"]');
                if (row) {
                    row.remove();
                }
                alert("Тип оборудования успешно удален.");
            } else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
                return;
            } else {
                alert("Ошибка при удалении типа оборудования.");
                return;
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении типа оборудования:', error);
            alert("Ошибка при удалении типа оборудования: " + error.message);
            return;
        });
    }
}

function submitEditForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEdit").value;
    var category = document.getElementById('edit_category').value;
    var name = document.getElementById('edit_name').value;
    var characteristic = document.getElementById('edit_characteristic').value;

    var equipmentType = {
        id: id,
        category: category,
        name: name,
        characteristic: characteristic
    };

    var jsonData = JSON.stringify(equipmentType);

    fetch('/equipmentType/' + id + '/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            updateTableRow(id, equipmentType);
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
        alert("Ошибка при редактировании типа оборудования: " + error.message);
        return;
    });
}

function submitCreateForm(event) {
    event.preventDefault();

    var category = document.getElementById('create_category').value;
    var name = document.getElementById('create_name').value;
    var characteristic = document.getElementById('create_characteristic').value;

    var equipmentType = {
        category: category,
        name: name,
        characteristic: characteristic
    };

    var jsonData = JSON.stringify(equipmentType);

    fetch('/equipmentType/create', {
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
            equipmentType.id = id;
            addRowToTable(equipmentType);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании типа оборудования: " + error.message);
        return;
    });
}

function addRowToTable(equipmentType) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(0);

    var cellId = newRow.insertCell(0);
    var cellCategory = newRow.insertCell(1);
    var cellName = newRow.insertCell(2);
    var cellCharacteristic = newRow.insertCell(3);
    newRow.setAttribute('data-id', equipmentType.id);

    cellId.textContent = equipmentType.id;
    cellCategory.textContent = equipmentType.category;
    cellName.textContent = equipmentType.name;
    cellCharacteristic.textContent = equipmentType.characteristic;
}

function updateTableRow(rowId, equipmentType) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = equipmentType.category;
        row.cells[2].textContent = equipmentType.name;
        row.cells[3].textContent = equipmentType.characteristic;
    }
}