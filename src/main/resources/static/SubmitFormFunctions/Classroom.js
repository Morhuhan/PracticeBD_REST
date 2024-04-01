function submitDeleteForm() {
    var classroomId = document.getElementById("IdToDelete").value;
    console.log("DELETE");
    if (confirm("Вы уверены, что хотите удалить запись с ID " + classroomId + "?")) {
        fetch('/classroom/' + classroomId + '/delete', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                var row = document.querySelector('tr[data-id="' + classroomId + '"]');
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
    var id_allocation = document.getElementById('edit_idAllocation').value;
    var current_num_of_places = document.getElementById('edit_currentNumOfPlaces').value;
    var max_num_of_places = document.getElementById('edit_maxNumOfPlaces').value;
    var department = document.getElementById('edit_department').value;
    var note = document.getElementById('edit_note').value;

    var classroom = {
        id: id,
        id_allocation: id_allocation,
        current_num_of_places: current_num_of_places,
        max_num_of_places: max_num_of_places,
        department: department,
        note: note
    };

    var jsonData = JSON.stringify(classroom);

    fetch('/classroom/' + id + '/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            updateTableRow(id, classroom);
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

    var id_allocation = document.getElementById('create_idAllocation').value;
    var current_num_of_places = document.getElementById('create_currentNumOfPlaces').value;
    var max_num_of_places = document.getElementById('create_maxNumOfPlaces').value;
    var department = document.getElementById('create_department').value;
    var note = document.getElementById('create_note').value;

    var classroom = {
        id_allocation: id_allocation,
        current_num_of_places: current_num_of_places,
        max_num_of_places: max_num_of_places,
        department: department,
        note: note
    };

    var jsonData = JSON.stringify(classroom);

    fetch('/classroom/create', {
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
            classroom.id = id;
            addRowToTable(classroom);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании записи: " + error.message);
        return;
    });
}

function addRowToTable(classroom) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(0);

    var cellId = newRow.insertCell(0);
    var cellIdAllocation = newRow.insertCell(1);
    var cellCurrentNumOfPlaces = newRow.insertCell(2);
    var cellMaxNumOfPlaces = newRow.insertCell(3);
    var cellDepartment = newRow.insertCell(4);
    var cellNote = newRow.insertCell(5);
    newRow.setAttribute('data-id', classroom.id);

    cellId.textContent = classroom.id;
    cellIdAllocation.textContent = classroom.id_allocation;
    cellCurrentNumOfPlaces.textContent = classroom.current_num_of_places;
    cellMaxNumOfPlaces.textContent = classroom.max_num_of_places;
    cellDepartment.textContent = classroom.department;
    cellNote.textContent = classroom.note;
}

function updateTableRow(rowId, classroom) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = classroom.id_allocation;
        row.cells[2].textContent = classroom.current_num_of_places;
        row.cells[3].textContent = classroom.max_num_of_places;
        row.cells[4].textContent = classroom.department;
        row.cells[5].textContent = classroom.note;
    }
}