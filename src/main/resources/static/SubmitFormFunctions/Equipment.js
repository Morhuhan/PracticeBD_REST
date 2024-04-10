document.addEventListener('DOMContentLoaded', function() {
    GetEquipmentPage(1);
    UpdateNavigationPanel();
});

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

// Изменяет строку на текущей странице в свзяи с новыми данными
function UpdateTableRow(rowId, equipment) {
    var row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        row.cells[1].textContent = equipment.id_equipmentType;
        row.cells[2].textContent = equipment.inv_number;
        row.cells[3].textContent = equipment.p_i;
        row.cells[4].textContent = equipment.note;
    }
}

// Подгружает новую страницу. Изменяет глобальну переменную currentPage.
// Удаляет все записи на странице и заменяет их новыми записями Equipment.
// Использует: EquipmentRowClick
function GetEquipmentPage(pageNumber) {

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

    // Перебираем массив GlobalArray и создаем строки таблицы
    for (var i = startIndex; i < startIndex + itemsPerPage && i < GlobalArray.length; i++) {
        var equipment = GlobalArray[i];
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

// Создает новую строку на текущей странице с указанными данными. Назначает новой строке событие при клике.
// Использует EquipmentRowClick
function AddRowToTable(equipment) {
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

// Переопределяет навигационную панель, высчитывает кол-во кнопок и навешивает на них GetEquipmentPage(i)
function UpdateNavigationPanel() {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    var navigationPanel = document.getElementById('navigationPanel');
    var totalItems = GlobalArray.length;

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
            GetEquipmentPage(i, itemsPerPage);
        });
        navigationPanel.appendChild(button);
    }
}

// Пытается передвинуть элемент со следующей страницы на текущую.
function MoveNextRowToCurrentPage() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    // Определяем индекс первого элемента на следующей странице
    var startIndexNextPage = currentPage * itemsPerPage - 1;
    // Проверяем, есть ли элементы на следующей странице
    if (startIndexNextPage < GlobalArray.length) {
        // Получаем элемент для переноса
        var equipmentToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из equipmentToMove
        AddRowToTable(equipmentToMove);
    }
}

// Вызывается в момент отправления формы deleteForm.
// Отправляет fetch запрос на сервер об удалении элемента с указанным id.
// Если ответ положительный - удаляет строку с таким id из таблицы !!!!!!!!!!!!!!!!!! (а если она на другой странице?)
// Проверяет, нужно ли изменить общее число страниц и кнопок на панели навигации.
// Использует: GetEquipmentPage
//             MoveNextRowToCurrentPage
//             UpdateNavigationPanel
function SubmitDeleteForm() {
    var equipmentId = document.getElementById("IdToDelete").value;

    if (confirm("Вы уверены, что хотите удалить оборудование с ID " + equipmentId + "?")) {
        fetch('/equipment/' + equipmentId + '/delete', {
            method: 'POST'
        })
        .then(response => {

            if (response.ok) {

                // Находим индекс выбранной строки
                var equipmentIndex = GlobalArray.findIndex(function(item) {
                    return item.id.toString() === equipmentId;
                });

                // Удаляем элемент из глобального массива GlobalArray
                GlobalArray = GlobalArray.filter(function(item) {
                    return item.id.toString() !== equipmentId;
                });

                var row = document.querySelector('tr[data-id="' + equipmentId + '"]');
                var table = document.getElementById('table');
                var rowsOnCurrentPage = document.querySelectorAll('tr[data-id]').length;
                var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
                var tbody = document.querySelector("#table > table > tbody");
                var totalItems = GlobalArray.length;

                // Проверяем, на какой странице находится строка
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + itemsPerPage;

                // Строка со следующей страницы
                if (equipmentIndex >= endIndex) {
                    UpdateNavigationPanel();
                }

                // Строка с предыдущей страницы
                else if (equipmentIndex < startIndex) {

                    // Если текущая страница крайняя, и на ней поседняя строка
                    if (currentPage === totalPages && rowsOnCurrentPage === 1 && currentPage > 1) {
                        currentPage--;
                        GetEquipmentPage(currentPage);
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
                        GetEquipmentPage(currentPage);
                    }

                    // Если текущая страница не кайняя
                    else {
                        row.remove();
                        MoveNextRowToCurrentPage();
                    }
                }

                UpdateNavigationPanel();
                alert("Оборудование успешно удалено.");
            }
            else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
            } else {
                alert("Ошибка при удалении оборудования.");
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении оборудования:', error);
            alert("Ошибка при удалении оборудования: " + error.message);
        });
    }
}


// Вызывается в момент отправления формы editForm.
// Отправляет fetch запрос на сервер об изменении элемента с указанным id указанными данными.
// Если ответ положительный - заполняет указанную строку данными.
// Использует: updateTableRow
function SubmitEditForm(event) {
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

            // Обновляем данные в глобальном массиве GlobalArray
            var index = GlobalArray.findIndex(function(item) {
                return item.id.toString() === id;
            });
            if (index !== -1) {
                GlobalArray[index] = equipment;
            }

            UpdateTableRow(id, equipment);

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
        alert("Ошибка при редактировании оборудования: " + error.message);
    });
}

// Вызывается в момент отправления формы createForm.
// Отправляет fetch запрос на сервер о создании элемента с указанными данными.
// Если ответ положительный - создает строку с указанными данными, присваивает ей id возвращаемый сервером.
// Проверяет, нужно ли изменить общее число страниц и кнопок на панели навигации.
// Использует updatePaginationPanelToCreate, AddRowToTable
function SubmitCreateForm(event) {
    event.preventDefault();

    var id_equipmentType = document.getElementById('create_idEquipmentType').value;
    var inv_number = document.getElementById('create_invNumber').value;
    var p_i = document.getElementById('create_pI').value;
    var note = document.getElementById('create_note').value;

    var totalItems = GlobalArray.length;
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
            GlobalArray.push(equipment);
            totalItems = GlobalArray.length;

            // Рассчитываем начальный и конечный индексы для текущей страницы
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            // Проверяем, есть ли место на текущей странице, если нет - просто обновляем панель навигации
            if (totalItems > startIndex && totalItems <= endIndex) {
                AddRowToTable(equipment);
            }
            else {
                UpdateNavigationPanel();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании оборудования: " + error.message);
        return;
    });
}







