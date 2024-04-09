function toggleMenu() {
    var submenu = document.getElementById("submenu");
    if (submenu.style.display === "none" || submenu.style.display === "") {
        submenu.style.display = "block";
    } else {
        submenu.style.display = "none";
    }
}

function ShowDeleteForm() {
    document.getElementById("forms").style.display = "block";
    document.getElementById("deleteForm").style.display = "block";
    document.getElementById("editForm").style.display = "none";
    document.getElementById("createForm").style.display = "none";
}

function ShowEditForm() {
    document.getElementById("forms").style.display = "block";
    document.getElementById("deleteForm").style.display = "none";
    document.getElementById("editForm").style.display = "block";
    document.getElementById("createForm").style.display = "none";
}

function ShowCreateForm() {
    document.getElementById("forms").style.display = "block";
    document.getElementById("deleteForm").style.display = "none";
    document.getElementById("editForm").style.display = "none";
    document.getElementById("createForm").style.display = "block";
}


function checkDataFormat(date) {
    var regex = /^\d{4}\-\d{2}\-\d{2}$/;
    return regex.test(date) ? 1 : 0;
}





