document.addEventListener('DOMContentLoaded', function() {
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    NextEquipmentPage(1, itemsPerPage); // Здесь вы можете установить желаемые значения для pageNumber и itemsPerPage
});

document.addEventListener('DOMContentLoaded', function() {
    initializePagination();
});

function initializePagination() {
    var totalItems = parseInt(document.getElementById('totalItems').getAttribute('data'));
    var itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    var paginationPanel = document.getElementById('navigationPanel');
    var pageCount = Math.ceil(totalItems / itemsPerPage);
    var tbody = document.querySelector('tbody[data-table-type]');
    var tableType = tbody.getAttribute('data-table-type');

    // Очищаем панель навигации перед добавлением новых кнопок
    paginationPanel.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        var button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', function() {
            switch(tableType) {
                case 'maintenance':
                    NextMaintenancePage(i, itemsPerPage);
                    break;
                case 'classroom':
                    NextClassroomPage(i, itemsPerPage);
                    break;
                case 'allocation':
                    NextAllocationPage(i, itemsPerPage);
                    break;
                case 'equipment':
                    NextEquipmentPage(i, itemsPerPage);
                    break;
                case 'equipmentType':
                    NextEquipmentTypePage(i, itemsPerPage);
                    break;
                case 'seat':
                    NextSeatPage(i, itemsPerPage);
                    break;
            }
        });
        paginationPanel.appendChild(button);
    }
}
