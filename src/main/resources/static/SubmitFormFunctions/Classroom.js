document.addEventListener('DOMContentLoaded', function() {
    GetClassroomPage(1);
    UpdateClassroomNavigationPanel();
});



function ClassroomRowClick() {
    var cells = this.cells;
    // Проверяем, какая форма открыта - изменения или удаления
    if (editForm.style.display === 'block') {
        // Если открыта форма изменения, заполняем поля формы значениями из ячеек
        document.getElementById("IdToEditClassroom").value = cells[0].textContent;
        document.getElementById("edit_id_allocation").value = cells[1].textContent;
        document.getElementById("edit_current_num_of_places").value = cells[2].textContent;
        document.getElementById("edit_max_num_of_places").value = cells[3].textContent;
        document.getElementById("edit_department").value = cells[4].textContent;
        document.getElementById("edit_note").value = cells[5].textContent;
    } else if (deleteForm.style.display === 'block') {
        // Если открыта форма удаления, заполняем поле формы значением из первой ячейки
        document.getElementById("IdToDeleteClassroom").value = cells[0].textContent;
    }

    // Выделить текущую строку и снять выделение с остальных
    var tableRows = document.querySelectorAll('#table table tr');
    tableRows.forEach(function(otherRow) {
        otherRow.classList.remove("selected");
    });
    this.classList.add("selected");
}

function MoveNextRowToCurrentPageClassroom() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    // Определяем индекс первого элемента на следующей странице
    var startIndexNextPage = currentPage * itemsPerPage - 1;
    // Проверяем, есть ли элементы на следующей странице
    if (startIndexNextPage < GlobalArray.length) {
        // Получаем элемент для переноса
        var classroomToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из classroomToMove
        AddRowToClassroomTable(classroomToMove);
    }
}

function MoveNextRowToCurrentPage() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    // Определяем индекс первого элемента на следующей странице
    var startIndexNextPage = currentPage * itemsPerPage - 1;
    // Проверяем, есть ли элементы на следующей странице
    if (startIndexNextPage < GlobalArray.length) {
        // Получаем элемент для переноса
        var classroomToMove = GlobalArray[startIndexNextPage];
        // Создаем строку таблицы с данными из classroomToMove
        AddRowToClassroomTable(classroomToMove);
    }
}

function GetClassroomPage(pageNumber) {

    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = pageNumber;
    var table = document.querySelector('#table table tbody');

    for (var i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
    }

    var startIndex = (pageNumber - 1) * itemsPerPage;

    for (var i = startIndex; i < startIndex + itemsPerPage && i < GlobalArray.length; i++) {
        var classroom = GlobalArray[i];
        var row = table.insertRow(-1);
        row.setAttribute('data-id', classroom.id);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        cell1.textContent = classroom.id;
        cell2.textContent = classroom.id_allocation;
        cell3.textContent = classroom.current_num_of_places;
        cell4.textContent = classroom.max_num_of_places;
        cell5.textContent = classroom.department;
        cell6.textContent = classroom.note;

        row.addEventListener('click', ClassroomRowClick);
    }
}

function AddRowToClassroomTable(classroom) {
    var tableBody = document.querySelector('#table tbody');

    var newRow = tableBody.insertRow(-1);

    var cellId = newRow.insertCell(0);
    var cellIdAllocation = newRow.insertCell(1);
    var cellCurrentNumOfPlaces = newRow.insertCell(2);
    var cellMaxNumOfPlaces = newRow.insertCell(3);
    var cellDepartment = newRow.insertCell(4);
    var cellNote = newRow.insertCell(5);
    newRow.setAttribute('data-id', classroom.id);

    newRow.addEventListener('click', ClassroomRowClick);

    cellId.textContent = classroom.id;
    cellIdAllocation.textContent = classroom.id_allocation;
    cellCurrentNumOfPlaces.textContent = classroom.current_num_of_places;
    cellMaxNumOfPlaces.textContent = classroom.max_num_of_places;
    cellDepartment.textContent = classroom.department;
    cellNote.textContent = classroom.note;
}

function UpdateClassroomNavigationPanel() {

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
                GetClassroomPage(pageNumber, itemsPerPage);
            }
        })(i));
        navigationPanel.appendChild(button);
    }
}

function SubmitDeleteClassroomForm() {
    var classroomId = document.getElementById("IdToDeleteClassroom").value;

    if (confirm("Вы уверены, что хотите удалить аудиторию с ID " + classroomId + "?")) {
        fetch('/classroom/' + classroomId + '/delete', {
            method: 'POST'
        })
        .then(response => {

            if (response.ok) {

                // Находим индекс выбранной аудитории
                var classroomIndex = GlobalArray.findIndex(function(item) {
                    return item.id.toString() === classroomId;
                });

                // Удаляем элемент из глобального массива GlobalArray
                GlobalArray = GlobalArray.filter(function(item) {
                    return item.id.toString() !== classroomId;
                });

                var row = document.querySelector('tr[data-id="' + classroomId + '"]');
                var table = document.getElementById('table');
                var rowsOnCurrentPage = document.querySelectorAll('tr[data-id]').length;
                var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
                var tbody = document.querySelector("#table > tbody");
                var totalItems = GlobalArray.length;

                // Проверяем, на какой странице находится строка
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + itemsPerPage;

                // Строка со следующей страницы
                if (classroomIndex >= endIndex) {
                    UpdateClassroomNavigationPanel();
                }

                // Строка с предыдущей страницы
                else if (classroomIndex < startIndex) {

                    // Если текущая страница крайняя, и на ней последняя строка
                    if (currentPage === totalPages && rowsOnCurrentPage === 1 && currentPage > 1) {
                        currentPage--;
                        GetClassroomPage(currentPage);
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
                        GetClassroomPage(currentPage);
                    }

                    // Если текущая страница не крайняя
                    else {
                        row.remove();
                        MoveNextRowToCurrentPage();
                    }
                }

                UpdateClassroomNavigationPanel();
                alert("Аудитория успешно удалена.");
            }
            else if (response.status === 500) {
                response.text().then(errorMessage => {
                    alert("Ошибка сервера: " + errorMessage);
                });
            } else {
                alert("Ошибка при удалении аудитории.");
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении аудитории:', error);
            alert("Ошибка при удалении аудитории: " + error.message);
        });
    }
}

function SubmitEditClassroomForm(event) {
    event.preventDefault();

    var id = document.getElementById("IdToEditClassroom").value;
    var id_allocation = document.getElementById('edit_id_allocation').value;
    var current_num_of_places = document.getElementById('edit_current_num_of_places').value;
    var max_num_of_places = document.getElementById('edit_max_num_of_places').value;
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

            // Обновляем данные в глобальном массиве GlobalArray
            var index = GlobalArray.findIndex(function(item) {
                return item.id.toString() === id;
            });
            if (index !== -1) {
                GlobalArray[index] = classroom;
            }

            UpdateClassroomTableRow(id, classroom);

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
        alert("Ошибка при редактировании аудитории: " + error.message);
    });
}

function SubmitCreateClassroomForm(event) {
    event.preventDefault();

    var id_allocation = document.getElementById('create_id_allocation').value;
    var current_num_of_places = document.getElementById('create_current_num_of_places').value;
    var max_num_of_places = document.getElementById('create_max_num_of_places').value;
    var department = document.getElementById('create_department').value;
    var note = document.getElementById('create_note').value;

    var totalItems = GlobalArray.length;
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);

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

            GlobalArray.push(classroom);
            totalItems = GlobalArray.length;

            // Рассчитываем начальный и конечный индексы для текущей страницы
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            // Проверяем, есть ли место на текущей странице, если нет - просто обновляем панель навигации
            if (totalItems > startIndex && totalItems <= endIndex) {
                AddRowToClassroomTable(classroom);
            }
            else {
                UpdateClassroomNavigationPanel();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ошибка при создании класса: " + error.message);
        return;
    });
}