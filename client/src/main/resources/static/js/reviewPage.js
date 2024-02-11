document.addEventListener("DOMContentLoaded", function() {

    $('#generate').click(function() {
        $('#dialogimport').show();
        $('body').addClass('dialog-open');
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

function generateServer(useDb) {

    const userInput = prompt("Insert a base path for your Api (default /api)")
    if (userInput !== null) {
        if (userInput.startsWith("/")) {
            userInput.substring(1)
        }
        if (userInput.endsWith("/")) {
            userInput.substring(userInput.length-1)
        }
    }

    const userInputDocs = prompt("Do you want swagger-ui docs (y/n)? (default yes)")
    let docs = true;
    if (userInputDocs !== null) {
        if (userInputDocs.endsWith("n")) {
            docs = false;
        }
    }
    $('#dialogimport').hide();
    $('body').removeClass('dialog-open');

    const data = {
        persistence: useDb,
        basePath: userInput || '',
        docs: docs
    };

    $.ajax({
        type: 'POST',
        url: 'generateServer',
        contentType: 'application/json',
        data: JSON.stringify(data),
        xhrFields: {
            responseType: 'blob' // Imposta il tipo di risposta come Blob
        },
        success: function (response) {
            // Crea un oggetto URL per il Blob
            const blobURL = URL.createObjectURL(response);

            // Crea un link HTML per il download del file
            const link = document.createElement('a');
            link.href = blobURL;
            link.download = 'restApiServer.zip'; // Nome del file da scaricare
            link.style.display = 'none';

            // Aggiungi il link al documento HTML
            document.body.appendChild(link);

            // Simula un clic sul link per avviare il download
            link.click();

            // Rimuovi il link dal documento
            document.body.removeChild(link);

            // Rilascia l'URL oggetto per il Blob
            URL.revokeObjectURL(blobURL);
        },
        error: function (error) {
            console.error('Error: ', error);
            alert("Error while generating the server")
        }
    });
}
