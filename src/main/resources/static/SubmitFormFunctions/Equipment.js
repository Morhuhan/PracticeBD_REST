
// Вызывается в момент отправления формы deleteForm.
// Отправляет fetch запрос на сервер об удалении элемента с указанным id.
// Если ответ положительный - удаляет строку с таким id из таблицы !!!!!!!!!!!!!!!!!! (а если она на другой странице?)
// Проверяет, нужно ли изменить общее число страниц и кнопок на панели навигации.
// Использует: updatePaginationPanelToDelete
function submitDeleteForm() {

    var equipmentId = document.getElementById("IdToDelete").value;
    var totalItems = parseInt(document.getElementById('totalItems').getAttribute('data'));
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);

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

                // Уменьшаем глобальную переменную кол-ва элементов
                var totalItemsElement = document.getElementById('totalItems');
                totalItems--;
                totalItemsElement.setAttribute('data', totalItems.toString());

                // Проверяем, нужно ли уменьшить кол-во кнопок на панели навигации
                updatePaginationPanelToDelete();

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

// Вызывается в момент отправления формы editForm.
// Отправляет fetch запрос на сервер об изменении элемента с указанным id указанными данными.
// Если ответ положительный - заполняет указанную строку данными.
// Использует: updateTableRow
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

// Вызывается в момент отправления формы createForm.
// Отправляет fetch запрос на сервер о создании элемента с указанными данными.
// Если ответ положительный - создает строку с указанными данными, присваивает ей id возвращаемый сервером.
// Проверяет, нужно ли изменить общее число страниц и кнопок на панели навигации.
// Использует updatePaginationPanelToCreate, addRowToTable
function submitCreateForm(event) {
    event.preventDefault();

    var id_equipmentType = document.getElementById('create_idEquipmentType').value;
    var inv_number = document.getElementById('create_invNumber').value;
    var p_i = document.getElementById('create_pI').value;
    var note = document.getElementById('create_note').value;

    var totalItems = parseInt(document.getElementById('totalItems').getAttribute('data'));
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);

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

            // Присваеваем ID, возвращаемый сервером
            equipment.id = id;

            // Проталкиваем новый элемент в глобальный массив, в связи с тем, что другие функции работают с данными,
            // передаваемыми сервером в качестве массива 1 раз при загрузке страницы, и у них нет возможности
            // работать со строками динамически добавленными без перезагрузки страницы.
            Equipment.push(equipment);

            // Увеличиваем глобальную переменную кол-ва элементов
            var totalItemsElement = document.getElementById('totalItems');
            totalItems++;
            totalItemsElement.setAttribute('data', totalItems.toString());

            // Рассчитываем начальный и конечный индексы для текущей страницы
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            // Проверяем, есть ли место на текущей странице, если нет - добавляем на следующую и пересчитываем кол-во страниц
            if (totalItems > startIndex && totalItems <= endIndex) {
                addRowToTable(equipment);
            } else {
                updatePaginationPanelToCreate();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании оборудования: " + error.message);
        return;
    });
}

// Создает новую строку на текущей странице с указанными данными. Назначает новой строке событие при клике.
// Использует EquipmentRowClick
function addRowToTable(equipment) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(-1);

    var cellId = newRow.insertCell(0);
    var cellIdEquipmentType = newRow.insertCell(1);
    var cellInvNumber = newRow.insertCell(2);
    var cellPI = newRow.insertCell(3);
    var cellNote = newRow.insertCell(4);
    newRow.setAttribute('data-id', equipment.id);

    // Назначаем обработчик события click для новой строки
    newRow.addEventListener('click', EquipmentRowClick);

    cellId.textContent = equipment.id;
    cellIdEquipmentType.textContent = equipment.id_equipmentType;
    cellInvNumber.textContent = equipment.inv_number;
    cellPI.textContent = equipment.p_i;
    cellNote.textContent = equipment.note;
}

function updatePaginationPanelToCreate() {
    var totalItems = parseInt(document.getElementById('totalItems').getAttribute('data'));
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    var paginationPanel = document.getElementById('navigationPanel');

    // Очищаем текущую панель навигации
    paginationPanel.innerHTML = '';

    // Вычисляем новое количество страниц
    var pageCount = Math.ceil(totalItems / itemsPerPage);

    // Создаем кнопки для каждой страницы
    for (let i = 1; i <= pageCount; i++) {
        var button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', function() {
            NextEquipmentPage(i, itemsPerPage);
        });
        paginationPanel.appendChild(button);
    }
}

function updatePaginationPanelToDelete() {
    var totalItems = parseInt(document.getElementById('totalItems').getAttribute('data')) - 1;
    document.getElementById('totalItems').setAttribute('data', totalItems.toString());
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    var paginationPanel = document.getElementById('navigationPanel');

    // Очищаем текущую панель навигации
    paginationPanel.innerHTML = '';

    // Вычисляем новое количество страниц
    var pageCount = Math.ceil(totalItems / itemsPerPage);

    // Создаем кнопки для каждой страницы
    for (let i = 1; i <= pageCount; i++) {
        var button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', function() {
            NextEquipmentPage(i, itemsPerPage);
        });
        paginationPanel.appendChild(button);
    }

    // Проверяем, остались ли записи на текущей странице
    var firstItemIndex = (currentPage - 1) * itemsPerPage;
    if (firstItemIndex >= totalItems && currentPage > 1) {
        // Если записей нет и это не первая страница, переходим к предыдущей странице
        currentPage--;
        NextEquipmentPage(currentPage, itemsPerPage);
    } else if (currentPage != pageCount) {
        // Если это не последняя страница, переносим строку со следующей страницы на текущую
        MoveRowToCurrentPage(currentPage, itemsPerPage);
    }
    // Если мы на последней странице и она не пуста, ничего не делаем

    // Обновляем атрибут текущей страницы, если мы на последней странице и она стала пустой
    if (currentPage > pageCount) {
        currentPage = pageCount;
    }
}

function MoveRowToCurrentPage(currentPage, itemsPerPage) {
    // Получаем индекс первой записи на следующей странице
    var firstItemOnNextPage = currentPage * itemsPerPage;
    // Проверяем, есть ли запись для переноса
    if (firstItemOnNextPage < Equipment.length) {
        // Получаем запись из глобального массива
        var itemToMove = Equipment[firstItemOnNextPage];
        // Добавляем запись в таблицу на текущей странице
        addRowToTable(itemToMove);

    }
}

// Изменяет строку на текущей странице в свзяи с новыми данными
function updateTableRow(rowId, equipment) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = equipment.id_equipmentType;
        row.cells[2].textContent = equipment.inv_number;
        row.cells[3].textContent = equipment.p_i;
        row.cells[4].textContent = equipment.note;
    }
}

function NextEquipmentPage(pageNumber, itemsPerPage) {

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

    // Перебираем массив Equipment и создаем строки таблицы
    for (var i = startIndex; i < startIndex + itemsPerPage && i < Equipment.length; i++) {
        var equipment = Equipment[i];
        var row = table.insertRow(-1); // Вставляем новую строку в конец таблицы
        row.setAttribute('data-id', equipment.id);

        // Создаем и заполняем ячейки для каждого поля оборудования
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.textContent = equipment.id;
        cell2.textContent = equipment.id_equipmentType;
        cell3.textContent = equipment.inv_number;
        cell4.textContent = equipment.p_i;
        cell5.textContent = equipment.note;

        // Навешиваем событие onClick на строку
        row.addEventListener('click', EquipmentRowClick);
    }
}

function EquipmentRowClick() {
    var cells = this.cells; // Получаем ячейки текущей строки
    var editForm = document.getElementById("editForm");
    var deleteForm = document.getElementById("deleteForm");

    // Проверяем, какая форма открыта - изменения или удаления
    if (editForm.style.display === 'block') {
        // Если открыта форма изменения, заполняем поля формы значениями из ячеек
        document.getElementById("IdToEdit").value = cells[0].textContent;
        document.getElementById("edit_idEquipmentType").value = cells[1].textContent;
        document.getElementById("edit_invNumber").value = cells[2].textContent;
        document.getElementById("edit_pI").value = cells[3].textContent;
        document.getElementById("edit_note").value = cells[4].textContent;
    } else if (deleteForm.style.display === 'block') {
        // Если открыта форма удаления, заполняем поле формы значением из первой ячейки
        document.getElementById("IdToDelete").value = cells[0].textContent;
    }

    // Выделить текущую строку и снять выделение с остальных
    var tableRows = document.querySelectorAll('#table table tr');
    tableRows.forEach(function(otherRow) {
        otherRow.classList.remove("selected");
    });
    this.classList.add("selected");
}

function changeEquipmentPerPage() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    NextEquipmentPage(1, parseInt(itemsPerPage));
}

function updatePageCount() {
    var totalItems = parseInt(document.getElementById('totalItems').getAttribute('data'));
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    var pageCount = Math.ceil(totalItems / itemsPerPage);
    var paginationPanel = document.getElementById('navigationPanel');

    // Если текущая страница больше, чем новое количество страниц, нужно уменьшить currentPage
    if (currentPage > pageCount) {
        currentPage = pageCount;
        setCurrentPage(currentPage); // Функция для установки текущей страницы, её нужно определить
    }
}