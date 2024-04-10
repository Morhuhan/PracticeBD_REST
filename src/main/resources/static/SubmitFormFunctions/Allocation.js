document.addEventListener('DOMContentLoaded', function() {
    GetAllocationPage(1);
    UpdateAllocationNavigationPanel();
});

function AllocationRowClick() {
    var cells = this.cells;
    // Проверяем, какая форма открыта - изменения или удаления
    if (editForm.style.display === 'block') {
        // Если открыта форма изменения, заполняем поля формы значениями из ячеек
        document.getElementById("IdToEditAllocation").value = cells[0].textContent;
        document.getElementById("edit_pref").value = cells[1].textContent;
        document.getElementById("edit_street").value = cells[2].textContent;
        document.getElementById("edit_house").value = cells[3].textContent;
        document.getElementById("edit_room").value = cells[4].textContent;
        document.getElementById("edit_phone").value = cells[5].textContent;
    } else if (deleteForm.style.display === 'block') {
        // Если открыта форма удаления, заполняем поле формы значением из первой ячейки
        document.getElementById("IdToDeleteAllocation").value = cells[0].textContent;
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
        var allocationToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из allocationToMove
        AddRowToAllocationTable(allocationToMove);
    }
}

function MoveNextAllocationToCurrentPage() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    // Определяем индекс первого элемента на следующей странице
    var startIndexNextPage = currentPage * itemsPerPage;
    // Проверяем, есть ли элементы на следующей странице
    if (startIndexNextPage < GlobalArray.length) {
        // Получаем элемент для переноса
        var allocationToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из allocationToMove
        AddRowToAllocationTable(allocationToMove);
    }
}

function GetAllocationPage(pageNumber) {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = pageNumber;
    var table = document.querySelector('#table table tbody');

    // Очищаем таблицу перед заполнением новыми данными
    for (var i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
    }

    var startIndex = (pageNumber - 1) * itemsPerPage;

    // Заполняем таблицу данными
    for (var i = startIndex; i < startIndex + itemsPerPage && i < GlobalArray.length; i++) {
        var allocation = GlobalArray[i];
        var row = table.insertRow(-1);
        row.setAttribute('data-id', allocation.id);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        cell1.textContent = allocation.id;
        cell2.textContent = allocation.pref;
        cell3.textContent = allocation.street;
        cell4.textContent = allocation.house;
        cell5.textContent = allocation.room;
        cell6.textContent = allocation.phone;

        row.addEventListener('click', AllocationRowClick);
    }
}

function AddRowToAllocationTable(allocation) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(-1);

    var cellId = newRow.insertCell(0);
    var cellPref = newRow.insertCell(1);
    var cellStreet = newRow.insertCell(2);
    var cellHouse = newRow.insertCell(3);
    var cellRoom = newRow.insertCell(4);
    var cellPhone = newRow.insertCell(5);
    newRow.setAttribute('data-id', allocation.id);

    newRow.addEventListener('click', AllocationRowClick);

    cellId.textContent = allocation.id;
    cellPref.textContent = allocation.pref;
    cellStreet.textContent = allocation.street;
    cellHouse.textContent = allocation.house;
    cellRoom.textContent = allocation.room;
    cellPhone.textContent = allocation.phone;
}

function UpdateAllocationNavigationPanel() {

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
                GetAllocationPage(pageNumber, itemsPerPage);
            }
        })(i));
        navigationPanel.appendChild(button);
    }
}

function SubmitDeleteAllocationForm() {
    var allocationId = document.getElementById("IdToDeleteAllocation").value;

    if (confirm("Вы уверены, что хотите удалить распределение с ID " + allocationId + "?")) {
        fetch('/allocation/' + allocationId + '/delete', {
            method: 'POST'
        })
        .then(response => {

            if (response.ok) {

                // Находим индекс выбранного распределения
                var allocationIndex = GlobalArray.findIndex(function(item) {
                    return item.id.toString() === allocationId;
                });

                // Удаляем элемент из глобального массива GlobalArray
                GlobalArray = GlobalArray.filter(function(item) {
                    return item.id.toString() !== allocationId;
                });

                var row = document.querySelector('tr[data-id="' + allocationId + '"]');
                var table = document.getElementById('table');
                var rowsOnCurrentPage = document.querySelectorAll('tr[data-id]').length;
                var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
                var tbody = document.querySelector("#table > table > tbody");
                var totalItems = GlobalArray.length;

                // Проверяем, на какой странице находится строка
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + itemsPerPage;

                // Строка со следующей страницы
                if (allocationIndex >= endIndex) {
                    UpdateAllocationNavigationPanel();
                }

                // Строка с предыдущей страницы
                else if (allocationIndex < startIndex) {

                    // Если текущая страница крайняя, и на ней последняя строка
                    if (currentPage === totalPages && rowsOnCurrentPage === 1 && currentPage > 1) {
                        currentPage--;
                        GetAllocationPage(currentPage);
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
                        GetAllocationPage(currentPage);
                    }

                    // Если текущая страница не крайняя
                    else {
                        row.remove();
                        MoveNextRowToCurrentPage();
                    }
                }

                UpdateAllocationNavigationPanel();
                alert("Распределение успешно удалено.");
            }
            else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
            } else {
                alert("Ошибка при удалении распределения.");
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении распределения:', error);
            alert("Ошибка при удалении распределения: " + error.message);
        });
    }
}

function SubmitEditAllocationForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEditAllocation").value;
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

            // Обновляем данные в глобальном массиве GlobalArray
            var index = GlobalArray.findIndex(function(item) {
                return item.id.toString() === id;
            });
            if (index !== -1) {
                GlobalArray[index] = allocation;
            }

            UpdateAllocationTableRow(id, allocation);

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
        alert("Ошибка при редактировании распределения: " + error.message);
    });
}

function SubmitCreateAllocationForm(event) {
    event.preventDefault();

    var pref = document.getElementById('create_pref').value;
    var street = document.getElementById('create_street').value;
    var house = document.getElementById('create_house').value;
    var room = document.getElementById('create_room').value;
    var phone = document.getElementById('create_phone').value;

    var totalItems = GlobalArray.length;
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);

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

            GlobalArray.push(allocation);
            totalItems = GlobalArray.length;

            // Рассчитываем начальный и конечный индексы для текущей страницы
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            // Проверяем, есть ли место на текущей странице, если нет - просто обновляем панель навигации
            if (totalItems > startIndex && totalItems <= endIndex) {
                AddRowToAllocationTable(allocation);
            }
            else {
                UpdateAllocationNavigationPanel();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании распределения: " + error.message);
        return;
    });
}