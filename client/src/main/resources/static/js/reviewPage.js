document.addEventListener("DOMContentLoaded", function() {

    $('#continue').click(function() {
        //$('#dialogimport').show();
        //$('body').addClass('dialog-open');

        $.ajax({
            type: 'POST',
            url: '/extraFeatures',
            contentType: 'application/json',
            data: document.getElementById("yamlContent").textContent,
            success: function(response) {
                window.location.href = response
            },
            error: function(error) {
                console.error('Error: ', error);
                alert("Error while proceeding to the next step")
            }
        });
    });

    // Chiudi la dialog se si clicca al di fuori di essa
    $(document).mouseup(function(e) {
        const dialog = $('#dialogimport');
        // Se il click non è all'interno della dialog o del pulsante "Import", chiudi la dialog
        if (!dialog.is(e.target) && dialog.has(e.target).length === 0 && !$('#import').is(e.target)) {
            dialog.hide();
            $('body').removeClass('dialog-open');
        }
    });

    const yamlContent = document.getElementById("yamlContent").textContent;
    const blob = new Blob([yamlContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);

    // Crea un link nascosto per il download
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "openApiSpecification.yaml";
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    // Aggiungi un evento al clic del pulsante di download
    document.getElementById("download").addEventListener("click", function () {
        // Simula il clic sul link nascosto per avviare il download
        downloadLink.click();
    });

    // Aggiungi gli eventi ai pulsanti
    document.getElementById("validate").addEventListener("click", validate);
    document.getElementById("save").addEventListener("click", saveYamlFile);
});


// Funzione per la validazione
function validate() {

    const data = {
        yaml: document.getElementById("yamlContent").textContent
    };

    $.ajax({
        type: 'POST',
        url: 'validateYaml',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response)
        },
        error: function (error) {
            console.error('Error: ', error);
            alert("Error while validating the specification")
        }
    });
}

function saveYamlFile() {

    const userInput = prompt("Enter the name to save the .yaml file");

    if (userInput !== null) {
        const data = {
            filename: userInput,
            yaml: document.getElementById("yamlContent").textContent
        };

        $.ajax({
            type: 'POST',
            url: 'setSpecification',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                console.log(response)
            },
            error: function (error) {
                console.error('Error: ', error);
                alert("Error during configuration saving")
            }
        });
    }
}