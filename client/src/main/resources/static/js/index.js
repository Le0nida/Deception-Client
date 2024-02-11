function creaNuovaSpecifica() {

    const data = {
        step: 'general'
    };

    $.ajax({
        type: 'POST',
        url: 'creazioneSpecifica',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            window.location.href = 'specificationInfos';
        },
        error: function (error) {
            console.error('Error: ', error);
        }
    });
}

function getLogs() {
    window.location.href = "logs"
}

function importaSpecificaEsistente() {

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        var fileContent = event.target.result;
        $.ajax({
            type: 'POST',
            url: '/importScheme',
            contentType: 'application/json',
            data: JSON.stringify(fileContent),
            success: function(response) {
                window.location.href = 'reviewPage'
            },
            error: function(error) {
                console.error("Error: ", error);
                alert("An error occurred while loading the file");
            }
        });
    };
    reader.readAsText(file);
}

function selezionaSpecifica() {
    var fileSelected = document.getElementById('entitySelect').value;
    if (fileSelected === null || fileSelected === "") {
        alert("Please select a specification");
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/getSpecification',
        contentType: 'application/json',
        data: fileSelected,
        success: function(response) {
            window.location.href = 'reviewPage'
        },
        error: function(error) {
            console.error("Error: ", error);
            alert("An error occurred while loading the specification");
        }
    });

}