document.addEventListener('DOMContentLoaded', function() {
    GetMaintenancePage(1);
    UpdateMaintenanceNavigationPanel();
});

function MaintenanceRowClick() {
    var cells = this.cells;
    // Проверяем, какая форма открыта - изменения или удаления
    if (editForm.style.display === 'block') {
        // Если открыта форма изменения, заполняем поля формы значениями из ячеек
        document.getElementById("IdToEditMaintenance").value = cells[0].textContent;
        document.getElementById("edit_id_seat").value = cells[1].textContent;
        document.getElementById("edit_id_equipment").value = cells[2].textContent;
        document.getElementById("edit_installation_date").value = cells[3].textContent;
        document.getElementById("edit_removal_date").value = cells[4].textContent;
    } else if (deleteForm.style.display === 'block') {
        // Если открыта форма удаления, заполняем поле формы значением из первой ячейки
        document.getElementById("IdToDeleteMaintenance").value = cells[0].textContent;
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
        var maintenanceToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из maintenanceToMove
        AddRowToMaintenanceTable(maintenanceToMove);
    }
}

function GetMaintenancePage(pageNumber) {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = pageNumber;
    var table = document.querySelector('#table table tbody');

    for (var i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
    }

    var startIndex = (pageNumber - 1) * itemsPerPage;

    for (var i = startIndex; i < startIndex + itemsPerPage && i < GlobalArray.length; i++) {
        var maintenance = GlobalArray[i];
        var row = table.insertRow(-1);
        row.setAttribute('data-id', maintenance.id);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.textContent = maintenance.id;
        cell2.textContent = maintenance.id_seat;
        cell3.textContent = maintenance.id_equipment;
        cell4.textContent = maintenance.installation_date;
        cell5.textContent = maintenance.removal_date;

        row.addEventListener('click', MaintenanceRowClick);
    }
}

function AddRowToMaintenanceTable(maintenance) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(-1);

    var cellId = newRow.insertCell(0);
    var cellIdSeat = newRow.insertCell(1);
    var cellIdEquipment = newRow.insertCell(2);
    var cellInstallationDate = newRow.insertCell(3);
    var cellRemovalDate = newRow.insertCell(4);
    newRow.setAttribute('data-id', maintenance.id);

    newRow.addEventListener('click', MaintenanceRowClick);

    cellId.textContent = maintenance.id;
    cellIdSeat.textContent = maintenance.id_seat;
    cellIdEquipment.textContent = maintenance.id_equipment;
    cellInstallationDate.textContent = maintenance.installation_date;
    cellRemovalDate.textContent = maintenance.removal_date;
}

function UpdateMaintenanceNavigationPanel() {

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
                GetMaintenancePage(pageNumber, itemsPerPage);
            }
        })(i));
        navigationPanel.appendChild(button);
    }
}

function SubmitDeleteMaintenanceForm() {
    var maintenanceId = document.getElementById("IdToDeleteMaintenance").value;

    if (confirm("Вы уверены, что хотите удалить запись об обслуживании с ID " + maintenanceId + "?")) {
        fetch('/maintenance/' + maintenanceId + '/delete', {
            method: 'POST'
        })
        .then(response => {

            if (response.ok) {

                // Находим индекс выбранной записи об обслуживании
                var maintenanceIndex = GlobalArray.findIndex(function(item) {
                    return item.id.toString() === maintenanceId;
                });

                // Удаляем элемент из глобального массива GlobalArray
                GlobalArray = GlobalArray.filter(function(item) {
                    return item.id.toString() !== maintenanceId;
                });

                var row = document.querySelector('tr[data-id="' + maintenanceId + '"]');
                var table = document.getElementById('table');
                var rowsOnCurrentPage = document.querySelectorAll('tr[data-id]').length;
                var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
                var tbody = document.querySelector("#table > table > tbody");
                var totalItems = GlobalArray.length;

                // Проверяем, на какой странице находится строка
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + itemsPerPage;

                // Строка со следующей страницы
                if (maintenanceIndex >= endIndex) {
                    UpdateMaintenanceNavigationPanel();
                }

                // Строка с предыдущей страницы
                else if (maintenanceIndex < startIndex) {

                    // Если текущая страница крайняя, и на ней последняя строка
                    if (currentPage === totalPages && rowsOnCurrentPage === 1 && currentPage > 1) {
                        currentPage--;
                        GetMaintenancePage(currentPage);
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
                        GetMaintenancePage(currentPage);
                    }

                    // Если текущая страница не крайняя
                    else {
                        row.remove();
                        MoveNextRowToCurrentPage();
                    }
                }

                UpdateMaintenanceNavigationPanel();
                alert("Запись об обслуживании успешно удалена.");
            }
            else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
            } else {
                alert("Ошибка при удалении записи об обслуживании.");
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении записи об обслуживании:', error);
            alert("Ошибка при удалении записи об обслуживании: " + error.message);
        });
    }
}

function SubmitEditMaintenanceForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEditMaintenance").value;
    var id_seat = document.getElementById('edit_id_seat').value;
    var id_equipment = document.getElementById('edit_id_equipment').value;
    var installation_date = document.getElementById('edit_installation_date').value;
    var removal_date = document.getElementById('edit_removal_date').value;

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

            // Обновляем данные в глобальном массиве GlobalArray
            var index = GlobalArray.findIndex(function(item) {
                return item.id.toString() === id;
            });
            if (index !== -1) {
                GlobalArray[index] = maintenance;
            }

            UpdateMaintenanceTableRow(id, maintenance);

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
        alert("Ошибка при редактировании записи обслуживания: " + error.message);
    });
}

function SubmitCreateMaintenanceForm(event) {
    event.preventDefault();

    var id_seat = document.getElementById('create_id_seat').value;
    var id_equipment = document.getElementById('create_id_equipment').value;
    var installation_date = document.getElementById('create_installation_date').value;
    var removal_date = document.getElementById('create_removal_date').value;

    var totalItems = GlobalArray.length;
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);

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
        if (id) {

            maintenance.id = id;

            GlobalArray.push(maintenance);
            totalItems = GlobalArray.length;

            // Рассчитываем начальный и конечный индексы для текущей страницы
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            // Проверяем, есть ли место на текущей странице, если нет - просто обновляем панель навигации
            if (totalItems > startIndex && totalItems <= endIndex) {
                AddRowToMaintenanceTable(maintenance);
            }
            else {
                UpdateMaintenanceNavigationPanel();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании записи обслуживания: " + error.message);
        return;
    });
}