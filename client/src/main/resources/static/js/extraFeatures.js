document.addEventListener("DOMContentLoaded", function() {

    $('#continue').click(function() {
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

});

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
