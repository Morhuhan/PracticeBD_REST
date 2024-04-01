function submitDeleteForm() {
    var seatId = document.getElementById("IdToDelete").value;
    console.log("DELETE");
    if (confirm("Вы уверены, что хотите удалить место с ID " + seatId + "?")) {
        fetch('/seat/' + seatId + '/delete', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                var row = document.querySelector('tr[data-id="' + seatId + '"]');
                if (row) {
                    row.remove();
                }
                alert("Место успешно удалено.");
            } else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
                return;
            } else {
                alert("Ошибка при удалении места.");
                return;
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении места:', error);
            alert("Ошибка при удалении места: " + error.message);
            return;
        });
    }
}

function submitEditForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEdit").value;
    var id_classroom = document.getElementById('edit_idClassroom').value;
    var number = document.getElementById('edit_number').value;
    var WS_name = document.getElementById('edit_WSName').value;
    var ip = document.getElementById('edit_ip').value;
    var note = document.getElementById('edit_note').value;

    var seat = {
        id: id,
        id_classroom: id_classroom,
        number: number,
        WS_name: WS_name,
        ip: ip,
        note: note
    };

    var jsonData = JSON.stringify(seat);

    fetch('/seat/' + id + '/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            updateTableRow(id, seat);
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
        alert("Ошибка при редактировании места: " + error.message);
        return;
    });
}

function submitCreateForm(event) {
    event.preventDefault();

    var id_classroom = document.getElementById('create_idClassroom').value;
    var number = document.getElementById('create_number').value;
    var WS_name = document.getElementById('create_WSName').value;
    var ip = document.getElementById('create_ip').value;
    var note = document.getElementById('create_note').value;

    var seat = {
        id_classroom: id_classroom,
        number: number,
        WS_name: WS_name,
        ip: ip,
        note: note
    };

    var jsonData = JSON.stringify(seat);

    fetch('/seat/create', {
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
            seat.id = id;
            addRowToTable(seat);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании места: " + error.message);
        return;
    });
}

function addRowToTable(seat) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(0);

    var cellId = newRow.insertCell(0);
    var cellIdClassroom = newRow.insertCell(1);
    var cellNumber = newRow.insertCell(2);
    var cellWSName = newRow.insertCell(3);
    var cellIp = newRow.insertCell(4);
    var cellNote = newRow.insertCell(5);
    newRow.setAttribute('data-id', seat.id);

    cellId.textContent = seat.id;
    cellIdClassroom.textContent = seat.id_classroom;
    cellNumber.textContent = seat.number;
    cellWSName.textContent = seat.WS_name;
    cellIp.textContent = seat.ip;
    cellNote.textContent = seat.note;
}

function updateTableRow(rowId, seat) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = seat.id_classroom;
        row.cells[2].textContent = seat.number;
        row.cells[3].textContent = seat.WS_name;
        row.cells[4].textContent = seat.ip;
        row.cells[5].textContent = seat.note;
    }
}