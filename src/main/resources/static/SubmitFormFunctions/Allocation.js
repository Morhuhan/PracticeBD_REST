function submitDeleteForm() {
    var allocationId = document.getElementById("IdToDelete").value;
    console.log("DELETE");
    if (confirm("Вы уверены, что хотите удалить запись с ID " + allocationId + "?")) {
        fetch('/allocation/' + allocationId + '/delete', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                var row = document.querySelector('tr[data-id="' + allocationId + '"]');
                if (row) {
                    row.remove();
                }
                alert("Запись успешно удалена.");
            } else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
                return;
            } else {
                alert("Ошибка при удалении записи.");
                return;
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении записи:', error);
            alert("Ошибка при удалении записи: " + error.message);
            return;
        });
    }
}

function submitEditForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEdit").value;
    var pref = document.getElementById('edit_pref').value;
    var street = document.getElementById('edit_street').value;
    var house = document.getElementById('edit_house').value;
    var room = document.getElementById('edit_room').value;
    var phone = document.getElementById('edit_phone').value;

    var allocation = {
        id: id,
        pref: pref,
        street: street,
        house: house,
        room: room,
        phone: phone
    };

    var jsonData = JSON.stringify(allocation);

    fetch('/allocation/' + id + '/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            updateTableRow(id, allocation);
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
        alert("Ошибка при редактировании записи: " + error.message);
        return;
    });
}

function submitCreateForm(event) {
    event.preventDefault();

    var pref = document.getElementById('create_pref').value;
    var street = document.getElementById('create_street').value;
    var house = document.getElementById('create_house').value;
    var room = document.getElementById('create_room').value;
    var phone = document.getElementById('create_phone').value;

    var allocation = {
        pref: pref,
        street: street,
        house: house,
        room: room,
        phone: phone
    };

    var jsonData = JSON.stringify(allocation);

    fetch('/allocation/create', {
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
            allocation.id = id;
            addRowToTable(allocation);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании записи: " + error.message);
        return;
    });
}

function addRowToTable(allocation) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(0);

    var cellId = newRow.insertCell(0);
    var cellPref = newRow.insertCell(1);
    var cellStreet = newRow.insertCell(2);
    var cellHouse = newRow.insertCell(3);
    var cellRoom = newRow.insertCell(4);
    var cellPhone = newRow.insertCell(5);
    newRow.setAttribute('data-id', allocation.id);

    cellId.textContent = allocation.id;
    cellPref.textContent = allocation.pref;
    cellStreet.textContent = allocation.street;
    cellHouse.textContent = allocation.house;
    cellRoom.textContent = allocation.room;
    cellPhone.textContent = allocation.phone;
}

function updateTableRow(rowId, allocation) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = allocation.pref;
        row.cells[2].textContent = allocation.street;
        row.cells[3].textContent = allocation.house;
        row.cells[4].textContent = allocation.room;
        row.cells[5].textContent = allocation.phone;
    }
}