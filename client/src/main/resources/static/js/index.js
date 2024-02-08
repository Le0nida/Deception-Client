function uploadFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    if (!file) {
        alert("Si prega di selezionare un file.");
        return;
    }

    var formData = new FormData();
    formData.append("file", file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("File caricato con successo!");
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            alert("Si è verificato un errore durante il caricamento del file.");
        }
    };
    xhr.send(formData);
}

function creaNuovaSpecifica() {
    // Recupera il token memorizzato
    // Creare un oggetto con i dati da inviare
    var data = {
        step: 'general'
    };

    // Eseguire la richiesta POST con Ajax
    $.ajax({
        type: 'POST',
        url: 'creazioneSpecifica',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            // Gestire la risposta dal server, se necessario
            window.location.href = 'specificationInfos';
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}


function generateImgFromZip() {

    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    if (!file) {
        alert("Si prega di selezionare un file.");
        return;
    }

    var formData = new FormData();
    formData.append('file', file);

    $.ajax({
        type: 'POST',
        url: '/generateImgFromZip',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response)
        },
        error: function(error) {
            console.error("Si è verificato un errore durante il caricamento del file: ", error);
        }
    });
}


function importaSpecificaEsistente() {

    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    if (!file) {
        alert("Si prega di selezionare un file.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var fileContent = event.target.result;
        $.ajax({
            type: 'POST',
            url: '/importScheme',
            contentType: 'application/json',
            data: JSON.stringify(fileContent),
            success: function(response) {
                window.location.href = response
            },
            error: function(error) {
                console.error("Si è verificato un errore durante il caricamento del file: ", error);
            }
        });
    };
    reader.readAsText(file);
}

function selezionaSpecifica() {
    var fileSelected = document.getElementById('entitySelect').value;
    if (fileSelected === null || fileSelected === "") {
        alert("Si prega di selezionare una specifica");
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/getSpecification',
        contentType: 'application/json',
        data: fileSelected,
        success: function(response) {
            window.location.href = response
        },
        error: function(error) {
            console.error("Si è verificato un errore durante la selezione dello schema: ", error);
        }
    });

}