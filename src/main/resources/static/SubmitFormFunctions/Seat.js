document.addEventListener('DOMContentLoaded', function() {
    GetSeatPage(1);
    UpdateSeatNavigationPanel();
});

function SeatRowClick() {var cells = this.cells;
    // Проверяем, какая форма открыта - изменения или удаления
    if (editForm.style.display === 'block') {
        // Если открыта форма изменения, заполняем поля формы значениями из ячеек
        document.getElementById("IdToEditSeat").value = cells[0].textContent;
        document.getElementById("edit_id_classroom").value = cells[1].textContent;
        document.getElementById("edit_number").value = cells[2].textContent;
        document.getElementById("edit_WS_name").value = cells[3].textContent;
        document.getElementById("edit_ip").value = cells[4].textContent;
        document.getElementById("edit_note").value = cells[5].textContent;
    } else if (deleteForm.style.display === 'block') {
        // Если открыта форма удаления, заполняем поле формы значением из первой ячейки
        document.getElementById("IdToDeleteSeat").value = cells[0].textContent;
    }

    // Выделить текущую строку и снять выделение с остальных
    var tableRows = document.querySelectorAll('#table table tr');
    tableRows.forEach(function(otherRow) {
        otherRow.classList.remove("selected");
    });
    this.classList.add("selected");
}

function MoveNextRowToCurrentPage() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    // Определяем индекс первого элемента на следующей странице
    var startIndexNextPage = currentPage * itemsPerPage - 1;
    // Проверяем, есть ли элементы на следующей странице
    if (startIndexNextPage < GlobalArray.length) {
        // Получаем элемент для переноса
        var seatToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из seatToMove
        AddRowToSeatTable(seatToMove);
    }
}

function MoveNextRowToCurrentPage() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    // Определяем индекс первого элемента на следующей странице
    var startIndexNextPage = currentPage * itemsPerPage - 1;
    // Проверяем, есть ли элементы на следующей странице
    if (startIndexNextPage < GlobalArray.length) {
        // Получаем элемент для переноса
        var seatToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из seatToMove
        AddRowToSeatTable(seatToMove);
    }
}

function GetSeatPage(pageNumber) {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = pageNumber;
    var table = document.querySelector('#table table tbody');

    for (var i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
    }

    var startIndex = (pageNumber - 1) * itemsPerPage;

    for (var i = startIndex; i < startIndex + itemsPerPage && i < GlobalArray.length; i++) {
        var seat = GlobalArray[i];
        var row = table.insertRow(-1);
        row.setAttribute('data-id', seat.id);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        cell1.textContent = seat.id;
        cell2.textContent = seat.id_classroom;
        cell3.textContent = seat.number;
        cell4.textContent = seat.WS_name;
        cell5.textContent = seat.ip;
        cell6.textContent = seat.note;

        row.addEventListener('click', SeatRowClick);
    }
}

function AddRowToSeatTable(seat) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(-1);

    var cellId = newRow.insertCell(0);
    var cellIdClassroom = newRow.insertCell(1);
    var cellNumber = newRow.insertCell(2);
    var cellWSName = newRow.insertCell(3);
    var cellIp = newRow.insertCell(4);
    var cellNote = newRow.insertCell(5);
    newRow.setAttribute('data-id', seat.id);

    newRow.addEventListener('click', SeatRowClick);

    cellId.textContent = seat.id;
    cellIdClassroom.textContent = seat.id_classroom;
    cellNumber.textContent = seat.number;
    cellWSName.textContent = seat.WS_name;
    cellIp.textContent = seat.ip;
    cellNote.textContent = seat.note;
}

function UpdateSeatNavigationPanel() {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    var navigationPanel = document.getElementById('navigationPanel');
    var totalItems = GlobalArray.length;

    navigationPanel.innerHTML = '';

    var pageCount = Math.ceil(totalItems / itemsPerPage);
    totalPages = pageCount;

    for (let i = 1; i <= pageCount; i++) {
        var button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', (function(pageNumber) {
            return function() {
                GetSeatPage(pageNumber, itemsPerPage);
            }
        })(i));
        navigationPanel.appendChild(button);
    }
}

function SubmitDeleteSeatForm() {
    var seatId = document.getElementById("IdToDeleteSeat").value;

    if (confirm("Вы уверены, что хотите удалить место с ID " + seatId + "?")) {
        fetch('/seat/' + seatId + '/delete', {
            method: 'POST'
        })
        .then(response => {

            if (response.ok) {

                // Находим индекс выбранного места
                var seatIndex = GlobalArray.findIndex(function(item) {
                    return item.id.toString() === seatId;
                });

                // Удаляем элемент из глобального массива GlobalArray
                GlobalArray = GlobalArray.filter(function(item) {
                    return item.id.toString() !== seatId;
                });

                var row = document.querySelector('tr[data-id="' + seatId + '"]');
                var table = document.getElementById('table');
                var rowsOnCurrentPage = document.querySelectorAll('tr[data-id]').length;
                var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
                var tbody = document.querySelector("#table > table > tbody");
                var totalItems = GlobalArray.length;

                // Проверяем, на какой странице находится строка
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + itemsPerPage;

                // Строка со следующей страницы
                if (seatIndex >= endIndex) {
                    UpdateSeatNavigationPanel();
                }

                // Строка с предыдущей страницы
                else if (seatIndex < startIndex) {

                    // Если текущая страница крайняя, и на ней последняя строка
                    if (currentPage === totalPages && rowsOnCurrentPage === 1 && currentPage > 1) {
                        currentPage--;
                        GetSeatPage(currentPage);
                    }

                    // Если текущая страница крайняя, и на ней не последняя строка
                    else if (currentPage === totalPages && rowsOnCurrentPage > 1 && currentPage > 1) {
                        tbody.deleteRow(0);
                    }

                    // Если текущая страница не крайняя
                    else {
                        tbody.deleteRow(0);
                        MoveNextRowToCurrentPage();
                    }
                }

                // Строка с текущей страницы
                else {

                    // Если текущая страница крайняя, и на ней не последняя строка
                    if (currentPage === totalPages && rowsOnCurrentPage > 1 && currentPage > 1) {
                        row.remove();
                    }

                    // Если текущая страница крайняя, и на ней последняя строка
                    else if (currentPage === totalPages && rowsOnCurrentPage === 1 && currentPage > 1) {
                        row.remove();
                        currentPage--;
                        GetSeatPage(currentPage);
                    }

                    // Если текущая страница не крайняя
                    else {
                        row.remove();
                        MoveNextRowToCurrentPage();
                    }
                }

                UpdateSeatNavigationPanel();
                alert("Место успешно удалено.");
            }
            else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
            } else {
                alert("Ошибка при удалении места.");
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении места:', error);
            alert("Ошибка при удалении места: " + error.message);
        });
    }
}

function SubmitEditSeatForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEditSeat").value;
    var id_classroom = document.getElementById('edit_id_classroom').value;
    var number = document.getElementById('edit_number').value;
    var WS_name = document.getElementById('edit_WS_name').value;
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

            // Обновляем данные в глобальном массиве GlobalArray
            var index = GlobalArray.findIndex(function(item) {
                return item.id.toString() === id;
            });
            if (index !== -1) {
                GlobalArray[index] = seat;
            }

            UpdateSeatTableRow(id, seat);

        } else if (response.status === 500) {
            response.text().then(errorMessage => {
                alert("Ошибка сервера: " + errorMessage);
            });
            return;
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при редактировании места: " + error.message);
    });
}

function SubmitCreateSeatForm(event) {
    event.preventDefault();

    var id_classroom = document.getElementById('create_id_classroom').value;
    var number = document.getElementById('create_number').value;
    var WS_name = document.getElementById('create_WS_name').value;
    var ip = document.getElementById('create_ip').value;
    var note = document.getElementById('create_note').value;

    var totalItems = GlobalArray.length;
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);

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

            GlobalArray.push(seat);
            totalItems = GlobalArray.length;

            // Рассчитываем начальный и конечный индексы для текущей страницы
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            // Проверяем, есть ли место на текущей странице, если нет - просто обновляем панель навигации
            if (totalItems > startIndex && totalItems <= endIndex) {
                AddRowToSeatTable(seat);
            }
            else {
                UpdateSeatNavigationPanel();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании места: " + error.message);
        return;
    });
}