document.addEventListener('DOMContentLoaded', function() {
    GetEquipmentTypePage(1);
    UpdateTypeNavigationPanel();
});


function SubmitDeleteTypeForm() {
    var typeId = document.getElementById("IdToDeleteType").value;

    if (confirm("Вы уверены, что хотите удалить тип оборудования с ID " + typeId + "?")) {
        fetch('/equipmentType/' + typeId + '/delete', {
            method: 'POST'
        })
        .then(response => {

            } else if (response.status === 500) {
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

function MoveNextTypeRowToCurrentPage() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    // Определяем индекс первого элемента на следующей странице
    var startIndexNextPage = currentPage * itemsPerPage;
    // Проверяем, есть ли элементы на следующей странице
    if (startIndexNextPage < equipmentTypes.length) {
        // Получаем элемент для переноса
        var equipmentTypeToMove = equipmentTypes[startIndexNextPage];
        // Создаем строку таблицы с данными из equipmentTypeToMove
        AddTypeRowToTable(equipmentTypeToMove);
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

            // Обновляем данные в глобальном массиве equipmentTypes
            var index = equipmentTypes.findIndex(function(item) {
                return item.id.toString() === id;
            });
            if (index !== -1) {
                equipmentTypes[index] = equipmentType;
            }

            UpdateTypeTableRow(id, equipmentType);

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

    var totalItems = equipmentTypes.length;
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
        }
    })
    .then(id => {
        if (id) {
            // Присваиваем ID, возвращенный сервером
            equipmentType.id = id;

            // Добавляем новый элемент в глобальный массив
            equipmentTypes.push(equipmentType);
            totalItems = equipmentTypes.length;

            // Рассчитываем начальный и конечный индексы для текущей страницы
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            // Проверяем, есть ли место на текущей странице, если нет - обновляем панель навигации
            if (totalItems > startIndex && totalItems <= endIndex) {
                AddTypeRowToTable(equipmentType);
            }
            else {
                UpdateTypeNavigationPanel();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании типа оборудования: " + error.message);
    });
}

function AddTypeRowToTable(equipmentType) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(-1);

    var cellId = newRow.insertCell(0);
    var cellCategory = newRow.insertCell(1);
    var cellName = newRow.insertCell(2);
    var cellCharacteristic = newRow.insertCell(3);
    newRow.setAttribute('data-id', equipmentType.id);

    // Назначаем обработчик события click для новой строки, если необходимо
    newRow.addEventListener('click', EquipmentTypeRowClick);

    cellId.textContent = equipmentType.id;
    cellCategory.textContent = equipmentType.category;
    cellName.textContent = equipmentType.name;
    cellCharacteristic.textContent = equipmentType.characteristic;
}

function UpdateTypeNavigationPanel() {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    var navigationPanel = document.getElementById('navigationPanel');
    var totalItems = equipmentTypes.length;

    // Очищаем текущую панель навигации
    navigationPanel.innerHTML = '';

    // Вычисляем новое количество страниц
    var pageCount = Math.ceil(totalItems / itemsPerPage);

    // Записываем новое количество страниц в глобальную переменную
    totalPages = pageCount;

    // Создаем кнопки для каждой страницы
    for (let i = 1; i <= pageCount; i++) {
        var button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', function() {
            GetEquipmentTypePage(i, itemsPerPage); // Убедитесь, что эта функция адаптирована под EquipmentType
        });
        navigationPanel.appendChild(button);
    }
}

function UpdateTypeTableRow(rowId, equipmentType) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = equipmentType.category;
        row.cells[2].textContent = equipmentType.name;
        row.cells[3].textContent = equipmentType.characteristic;
    }
}

function GetEquipmentTypePage(pageNumber) {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);

    // Обновляем глобальную переменную номера текущей страницы
    currentPage = pageNumber;

    // Получаем таблицу по идентификатору
    var table = document.querySelector('#table table tbody');

    // Удаляем существующие строки, кроме заголовка таблицы
    for (var i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
    }

    // Вычисляем индекс начальной записи для текущей страницы
    var startIndex = (pageNumber - 1) * itemsPerPage;

    // Перебираем массив equipmentTypes и создаем строки таблицы
    for (var i = startIndex; i < startIndex + itemsPerPage && i < equipmentTypes.length; i++) {
        var equipmentType = equipmentTypes[i];
        var row = table.insertRow(-1);
        row.setAttribute('data-id', equipmentType.id);

        // Создаем и заполняем ячейки для каждого поля типа оборудования
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

