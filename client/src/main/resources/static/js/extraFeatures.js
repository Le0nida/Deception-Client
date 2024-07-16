function validateFeatures() {
    const jwtAuthPaths = $('#jwtPaths').val();
    const jwtUser = $('#jwtUser').val();
    const jwtPass = $('#jwtPass').val();
    const adminUser = $('#adminUser').val();
    const adminPass = $('#adminPass').val();
    const notAuthPaths = $('#notAuthPaths').val();

    // Validation checks
    if ((jwtUser && !jwtPass) || (!jwtUser && jwtPass)) {
        alert("Both JWT username and password must be provided or neither.");
        return false;
    }

    if ((adminUser && !adminPass) || (!adminUser && adminPass)) {
        alert("Both admin username and password must be provided or neither.");
        return false;
    }

    const pathRegex = /^\/[^,]+(\/[^,]*)*(\/\*\*)?(, \/[^,]+(\/[^,]*)*(\/\*\*)?)*$/;
    if (jwtAuthPaths && !pathRegex.test(jwtAuthPaths)) {
        alert("Invalid syntax in JWT Authentication paths.");
        return false;
    }

    if (notAuthPaths && !pathRegex.test(notAuthPaths)) {
        alert("Invalid syntax in Not Authorized paths.");
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function() {

    $('#showReviewedPaths').click(function () {
        $('#page-cover').show();
        $('#reviewedPathsDialog').show();
    });

    $('#closeReviewedPathsDialog').click(function () {
        $('#reviewedPathsDialog').hide();
        $('#page-cover').hide();
    });

    $('#generate').click(function() {
        if (validateFeatures()) {
            $('#dialogimport').show();
            $('body').addClass('dialog-open');
        }

    });

    $('#reset').click(function () {
        $('#jwtPaths').val('');
        $('#jwtUser').val('');
        $('#jwtPass').val('');
        $('#adminUser').val('');
        $('#adminPass').val('');
        $('#notAuthPaths').val('');
        $('#session').prop('checked', false)
        $('#vuln').prop('checked', false)
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

    const jwtAuthPaths = $('#jwtPaths').val();
    const jwtUser = $('#jwtUser').val();
    const jwtPass = $('#jwtPass').val();
    const adminUser = $('#adminUser').val();
    const adminPass = $('#adminPass').val();
    const notAuthPaths = $('#notAuthPaths').val();

    const data = {
        persistence: useDb,
        basePath: userInput || '',
        docs: docs,
        jwtAuthPaths: jwtAuthPaths,
        jwtUser: jwtUser,
        jwtPass: jwtPass,
        adminCredentialsUser: adminUser,
        adminCredentialsPass: adminPass,
        notAuthPaths: notAuthPaths,
        sessionBool: $('#session').is(':checked'),
        vulnBool: $('#vuln').is(':checked')
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

