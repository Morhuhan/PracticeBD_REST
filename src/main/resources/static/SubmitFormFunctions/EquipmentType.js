document.addEventListener('DOMContentLoaded', function() {
    GetEquipmentTypePage(1);
    UpdateEquipmentTypeNavigationPanel();
});

function EquipmentTypeRowClick() {
    var cells = this.cells; // Получаем ячейки текущей строки
    var editForm = document.getElementById("editForm");
    var deleteForm = document.getElementById("deleteForm");

    // Проверяем, какая форма открыта - изменения или удаления
    if (editForm.style.display === 'block') {
        // Если открыта форма изменения, заполняем поля формы значениями из ячеек
        document.getElementById("IdToEditType").value = cells[0].textContent;
        document.getElementById("edit_category").value = cells[1].textContent;
        document.getElementById("edit_name").value = cells[2].textContent;
        document.getElementById("edit_characteristic").value = cells[3].textContent;
    } else if (deleteForm.style.display === 'block') {
        // Если открыта форма удаления, заполняем поле формы значением из первой ячейки
        document.getElementById("IdToDeleteType").value = cells[0].textContent;
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
        var equipmentToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из equipmentToMove
        AddRowToEquipmentTypeTable(equipmentToMove);
    }
}

function UpdateEquipmentTypeTableRow(rowId, equipmentType) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = equipmentType.category;
        row.cells[2].textContent = equipmentType.name;
        row.cells[3].textContent = equipmentType.characteristic;
    }
}

function GetEquipmentTypePage(pageNumber) {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = pageNumber;
    var table = document.querySelector('#table table tbody');

    for (var i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
    }

    var startIndex = (pageNumber - 1) * itemsPerPage;

    for (var i = startIndex; i < startIndex + itemsPerPage && i < GlobalArray.length; i++) {
        var equipmentType = GlobalArray[i];
        var row = table.insertRow(-1);
        row.setAttribute('data-id', equipmentType.id);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.textContent = equipmentType.id;
        cell2.textContent = equipmentType.category;
        cell3.textContent = equipmentType.name;
        cell4.textContent = equipmentType.characteristic;

        row.addEventListener('click', EquipmentTypeRowClick);
    }
}

function AddRowToEquipmentTypeTable(equipmentType) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(-1);

    var cellId = newRow.insertCell(0);
    var cellCategory = newRow.insertCell(1);
    var cellName = newRow.insertCell(2);
    var cellCharacteristic = newRow.insertCell(3);
    newRow.setAttribute('data-id', equipmentType.id);

    newRow.addEventListener('click', EquipmentTypeRowClick);

    cellId.textContent = equipmentType.id;
    cellCategory.textContent = equipmentType.category;
    cellName.textContent = equipmentType.name;
    cellCharacteristic.textContent = equipmentType.characteristic;
}

function UpdateEquipmentTypeNavigationPanel() {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    var navigationPanel = document.getElementById('navigationPanel');
    var totalItems = GlobalArray.length;

    navigationPanel.innerHTML = '';

    var pageCount = Math.ceil(totalItems / itemsPerPage);
    totalPages = pageCount;

    for (let i = 1; i <= pageCount; i++) {
        var button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', function() {
            GetEquipmentTypePage(i, itemsPerPage);
        });
        navigationPanel.appendChild(button);
    }
}

function SubmitDeleteTypeForm() {
    var equipmentTypeId = document.getElementById("IdToDeleteType").value;

    if (confirm("Вы уверены, что хотите удалить тип оборудования с ID " + equipmentTypeId + "?")) {
        fetch('/equipmentType/' + equipmentTypeId + '/delete', {
            method: 'POST'
        })
        .then(response => {

            if (response.ok) {

                // Находим индекс выбранного типа оборудования
                var equipmentTypeIndex = GlobalArray.findIndex(function(item) {
                    return item.id.toString() === equipmentTypeId;
                });

                // Удаляем элемент из глобального массива GlobalArray
                GlobalArray = GlobalArray.filter(function(item) {
                    return item.id.toString() !== equipmentTypeId;
                });

                var row = document.querySelector('tr[data-id="' + equipmentTypeId + '"]');
                var table = document.getElementById('table');
                var rowsOnCurrentPage = document.querySelectorAll('tr[data-id]').length;
                var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
                var tbody = document.querySelector("#table > table > tbody");
                var totalItems = GlobalArray.length;

                // Проверяем, на какой странице находится строка
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + itemsPerPage;

                // Строка со следующей страницы
                if (equipmentTypeIndex >= endIndex) {
                    UpdateEquipmentTypeNavigationPanel();
                }

                // Строка с предыдущей страницы
                else if (equipmentTypeIndex < startIndex) {

                    // Если текущая страница крайняя, и на ней последняя строка
                    if (currentPage === totalPages && rowsOnCurrentPage === 1 && currentPage > 1) {
                        currentPage--;
                        GetEquipmentTypePage(currentPage);
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
                        GetEquipmentTypePage(currentPage);
                    }

                    // Если текущая страница не крайняя
                    else {
                        row.remove();
                        MoveNextRowToCurrentPage();
                    }
                }

                UpdateEquipmentTypeNavigationPanel();
                alert("Тип оборудования успешно удален.");
            }
            else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
            } else {
                alert("Ошибка при удалении типа оборудования.");
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении типа оборудования:', error);
            alert("Ошибка при удалении типа оборудования: " + error.message);
        });
    }
}

function SubmitEditTypeForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEditType").value;
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

            // Обновляем данные в глобальном массиве GlobalArray
            var index = GlobalArray.findIndex(function(item) {
                return item.id.toString() === id;
            });
            if (index !== -1) {
                GlobalArray[index] = equipmentType;
            }

            UpdateEquipmentTypeTableRow(id, equipmentType);

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
        alert("Ошибка при редактировании типа оборудования: " + error.message);
    });
}

function SubmitCreateTypeForm(event) {
    event.preventDefault();

    var category = document.getElementById('create_category').value;
    var name = document.getElementById('create_name').value;
    var characteristic = document.getElementById('create_characteristic').value;

    var totalItems = GlobalArray.length;
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);

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

            GlobalArray.push(equipmentType);
            totalItems = GlobalArray.length;

            // Рассчитываем начальный и конечный индексы для текущей страницы
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            // Проверяем, есть ли место на текущей странице, если нет - просто обновляем панель навигации
            if (totalItems > startIndex && totalItems <= endIndex) {
                AddRowToEquipmentTypeTable(equipmentType);
            }
            else {
                UpdateEquipmentTypeNavigationPanel();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании типа оборудования: " + error.message);
        return;
    });
}
