document.addEventListener("DOMContentLoaded", function() {
    var table = document.querySelector("#table tbody");
    var observer = new MutationObserver(updateEventListeners);

    observer.observe(table, {
        childList: true, // наблюдаем за изменением детей
        subtree: true // и поддеревьев
    });

    function updateEventListeners() {
        // Получим все строки таблицы
        var tableRows = document.querySelectorAll("#table tbody tr");

        // Переберем каждую строку и добавим обработчик события click
        tableRows.forEach(function(row) {
            // Сначала удалим предыдущий обработчик, если он был установлен
            row.removeEventListener("click", rowClickHandler);

            // Теперь добавим новый обработчик
            row.addEventListener("click", rowClickHandler);
        });
    }

    function rowClickHandler() {
        // Получим все строки таблицы внутри обработчика, чтобы они были доступны для использования
        var tableRows = document.querySelectorAll("#table tbody tr");

        var tableType = this.parentNode.getAttribute('data-table-type'); // Получим тип таблицы
        var cells = this.cells;

        if(document.getElementById("editForm").style.display === 'block') {
            switch(tableType) {
                case 'maintenance':
                    document.getElementById("IdToEdit").value = cells[0].textContent;
                    document.getElementById("edit_idSeat").value = cells[1].textContent;
                    document.getElementById("edit_idEquipment").value = cells[2].textContent;
                    document.getElementById("edit_installationDate").value = cells[3].textContent;
                    document.getElementById("edit_removalDate").value = cells[4].textContent;
                    break;

                case 'classroom':
                    document.getElementById("IdToEdit").value = cells[0].textContent;
                    document.getElementById("edit_idAllocation").value = cells[1].textContent;
                    document.getElementById("edit_currentNumOfPlaces").value = cells[2].textContent;
                    document.getElementById("edit_maxNumOfPlaces").value = cells[3].textContent;
                    document.getElementById("edit_department").value = cells[4].textContent;
                    document.getElementById("edit_note").value = cells[5].textContent;
                    break;

                case 'allocation':
                    document.getElementById("IdToEdit").value = cells[0].textContent;
                    document.getElementById("edit_pref").value = cells[1].textContent;
                    document.getElementById("edit_street").value = cells[2].textContent;
                    document.getElementById("edit_house").value = cells[3].textContent;
                    document.getElementById("edit_room").value = cells[4].textContent;
                    document.getElementById("edit_phone").value = cells[5].textContent;
                    break;

                case 'equipment':
                    document.getElementById("IdToEdit").value = cells[0].textContent;
                    document.getElementById("edit_idEquipmentType").value = cells[1].textContent;
                    document.getElementById("edit_invNumber").value = cells[2].textContent;
                    document.getElementById("edit_pI").value = cells[3].textContent;
                    document.getElementById("edit_note").value = cells[4].textContent;
                    break;

                case 'equipmentType':
                    document.getElementById("IdToEdit").value = cells[0].textContent;
                    document.getElementById("edit_category").value = cells[1].textContent;
                    document.getElementById("edit_name").value = cells[2].textContent;
                    document.getElementById("edit_characteristic").value = cells[3].textContent;
                    break;

                case 'seat':
                    document.getElementById("IdToEdit").value = cells[0].textContent;
                    document.getElementById("edit_idClassroom").value = cells[1].textContent;
                    document.getElementById("edit_number").value = cells[2].textContent;
                    document.getElementById("edit_WSName").value = cells[3].textContent;
                    document.getElementById("edit_ip").value = cells[4].textContent;
                    document.getElementById("edit_note").value = cells[5].textContent;
                    break;
            }
        }
        else if(document.getElementById("deleteForm").style.display === 'block') {
            // Переносим ID в поле удаляемой записи, если открыта форма удаления
            document.getElementById("IdToDelete").value = cells[0].textContent;
        }

        // Выделить текущую строку и снять выделение с остальных
        tableRows.forEach(function(otherRow) {
            otherRow.classList.remove("selected");
        });
        this.classList.add("selected");
    }

    // Вызовем функцию в первый раз при загрузке страницы
    updateEventListeners();
});