document.addEventListener("DOMContentLoaded", function() {
    // Получим все строки таблицы
    var tableRows = document.querySelectorAll("#table tbody tr");

    // Переберем каждую строку и добавим обработчик события click
    tableRows.forEach(function(row) {
        row.addEventListener("click", function() {
            var tableType = this.parentNode.getAttribute('data-table-type'); // Получим тип таблицы

            if(document.getElementById("editForm").style.display === 'block') {
                switch(tableType) {
                    case 'maintenance':
                        if(document.getElementById("editForm").style.display === 'block') {
                            var cells = this.cells;
                            document.getElementById("IdToEdit").value = cells[0].textContent;
                            document.getElementById("edit_idSeat").value = cells[1].textContent;
                            document.getElementById("edit_idEquipment").value = cells[2].textContent;
                            document.getElementById("edit_installationDate").value = cells[3].textContent;
                            document.getElementById("edit_removalDate").value = cells[4].textContent;
                        }
                        break;

                    case 'classroom':
                        if(document.getElementById("editForm").style.display === 'block') {
                            var cells = this.cells;
                            document.getElementById("IdToEdit").value = cells[0].textContent;
                            document.getElementById("edit_idAllocation").value = cells[1].textContent;
                            document.getElementById("edit_currentNumOfPlaces").value = cells[2].textContent;
                            document.getElementById("edit_maxNumOfPlaces").value = cells[3].textContent;
                            document.getElementById("edit_department").value = cells[4].textContent;
                            document.getElementById("edit_note").value = cells[5].textContent;
                        }
                        break;

                    case 'allocation':
                        if(document.getElementById("editForm").style.display === 'block') {
                            var cells = this.cells;
                            document.getElementById("IdToEdit").value = cells[0].textContent;
                            document.getElementById("edit_pref").value = cells[1].textContent;
                            document.getElementById("edit_street").value = cells[2].textContent;
                            document.getElementById("edit_house").value = cells[3].textContent;
                            document.getElementById("edit_room").value = cells[4].textContent;
                            document.getElementById("edit_phone").value = cells[5].textContent;
                        }
                        break;

                    case 'equipment':
                        if(document.getElementById("editForm").style.display === 'block') {
                            var cells = this.cells;
                            document.getElementById("IdToEdit").value = cells[0].textContent;
                            document.getElementById("edit_idEquipmentType").value = cells[1].textContent;
                            document.getElementById("edit_invNumber").value = cells[2].textContent;
                            document.getElementById("edit_pI").value = cells[3].textContent;
                            document.getElementById("edit_note").value = cells[4].textContent;
                        }
                        break;

                    case 'equipmentType':
                        if(document.getElementById("editForm").style.display === 'block') {
                            var cells = this.cells;
                            document.getElementById("IdToEdit").value = cells[0].textContent;
                            document.getElementById("edit_category").value = cells[1].textContent;
                            document.getElementById("edit_name").value = cells[2].textContent;
                            document.getElementById("edit_characteristic").value = cells[3].textContent;
                        }
                        break;

                    case 'seat':
                        if(document.getElementById("editForm").style.display === 'block') {
                            var cells = this.cells;
                            document.getElementById("IdToEdit").value = cells[0].textContent;
                            document.getElementById("edit_idClassroom").value = cells[1].textContent;
                            document.getElementById("edit_number").value = cells[2].textContent;
                            document.getElementById("edit_WSName").value = cells[3].textContent;
                            document.getElementById("edit_ip").value = cells[4].textContent;
                            document.getElementById("edit_note").value = cells[5].textContent;
                        }
                        break;
                }
            }
            else if(document.getElementById("deleteForm").style.display === 'block') {
                // Переносим ID в поле удаляемой записи, если открыта форма удаления
                document.getElementById("IdToDelete").value = this.cells[0].textContent;
            }

            // Выделить текущую строку и снять выделение с остальных
            tableRows.forEach(function(otherRow) {
                otherRow.classList.remove("selected");
            });
            this.classList.add("selected");
        });
    });
});