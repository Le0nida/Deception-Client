const serverKeyDescMap = new Map();

// Regex per la validazione
const regex = {
    // Regex per l'URL
    url: /^(ftp|http|https):\/\/[^ "]+$/,
    // Regex per l'indirizzo email
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // Regex per la versione
    version: /^\d+\.\d+\.\d+$/
};

function saveConfig() {
    const userInput = prompt("Enter the name to save the configuration");

    // Controlla se l'utente ha inserito un valore
    if (userInput !== null) {
        const apiSpec = buildApiSpec();

        // Creare un oggetto con i dati da inviare
        const data = {
            filename: userInput,
            generalInfo: JSON.stringify(apiSpec)
        };

        // Eseguire la richiesta POST con Ajax
        $.ajax({
            type: 'POST',
            url: 'setGeneralInfos',
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

document.addEventListener("DOMContentLoaded", function() {
    // Mostra la dialog e aggiunge la classe dialog-open al body
    $('#import').click(function() {
        $('#dialogimport').show();
        $('body').addClass('dialog-open');
    });

    $('#save').click(function() {
        saveConfig();
    });

    $('#reset').click(function() {
        const confirmSave = window.confirm('Empty all fields?');
        if (confirmSave) {
            // Imposta i valori dei campi della pagina con la risposta, gestendo i valori nulli
            $('#openapi').val('');
            $('#titleInfo').val('');
            $('#descriptionInfo').val('');
            $('#termsOfServiceInfo').val('');
            $('#versionInfo').val('');
            $('#nameContact').val('');
            $('#urlContact').val('');
            $('#emailContact').val('');
            $('#nameLicense').val('');
            $('#urlLicense').val('');
            $('#identifier').val('');
            $('#externalDocsDescription').val('');
            $('#externalDocsUrl').val('');

            $('#addedServers').empty();
            serverKeyDescMap.clear()
        }
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

function fillValues(selectedOption) {

    $.ajax({
        type: 'POST',
        url: 'getGeneralInfos',
        contentType: 'application/json',
        data: selectedOption,
        success: function (response) {

            const responseObject = JSON.parse(response)
            // Imposta i valori dei campi della pagina con la risposta, gestendo i valori nulli
            $('#openapi').val(responseObject.openapi || '');
            $('#titleInfo').val(responseObject.info.title || '');
            $('#descriptionInfo').val(responseObject.info.description || '');
            $('#termsOfServiceInfo').val(responseObject.info.termsOfService || '');
            $('#versionInfo').val(responseObject.info.version || '');
            $('#nameContact').val(responseObject.info.contact.name || '');
            $('#urlContact').val(responseObject.info.contact.url || '');
            $('#emailContact').val(responseObject.info.contact.email || '');
            $('#nameLicense').val(responseObject.info.license.name || '');
            $('#urlLicense').val(responseObject.info.license.url || '');
            $('#identifier').val(responseObject.info.license.identifier || '');
            $('#externalDocsDescription').val(responseObject.externalDocs.description || '');
            $('#externalDocsUrl').val(responseObject.externalDocs.url || '');

            $('#addedServers').empty();
            serverKeyDescMap.clear()

            // Popola i server se presenti nella risposta
            if (responseObject.servers && responseObject.servers.length > 0) {
                responseObject.servers.forEach(function(server) {
                    addServerButton(server.url);
                    serverKeyDescMap.set(server.url, server.description)
                });
            }
        },
        error: function (error) {
            console.error('Error: ', error);
            alert("Error during configuration retrieval")
        }
    });

}

function confirmSelection() {
    const selectedOption = $('#selectOption').val();
    if (selectedOption === null || selectedOption === "") {
        alert("Please select a configuration");
        return;
    }
    // Esegui le azioni desiderate con l'opzione selezionata
    console.log("Option selected:", selectedOption);
    fillValues(selectedOption)
    // Chiudi la dialog
    $('#dialogimport').hide();
    $('body').removeClass('dialog-open');
}


function addServer() {
    const serverUrl = document.getElementById('serverUrl');
    const serverUrlValue = serverUrl.value.trim();
    if (isEmptyString(serverUrlValue)) {
        alert("The 'url' field of a server cannot be empty.");
        return;
    }
    // Se il campo non è vuoto
    if (serverUrlValue !== '') {
        // Verifica la corrispondenza con la regex
        if (!regex["version"].test(serverUrlValue)) {
            // Se non corrisponde, evidenzia il campo di rosso
            serverUrl.style.borderColor = 'red';
            alert("The 'url' field does not comply with the syntax.");
            return;
        } else {
            // Altrimenti, reimposta il colore del bordo
            serverUrl.style.borderColor = '';
        }
    }

    const serverDescInput = document.getElementById('serverDescription');
    const serverDescValue = serverDescInput.value.trim();

    serverKeyDescMap.set(serverUrlValue, serverDescValue);

    addServerButton(serverUrlValue)

    serverDescInput.value = '';
    serverUrl.value = '';
}

function addServerButton(value) {
    addButton(value, 'addedServers', null)
}

function buildApiSpec() {
    const apiSpec = new ApiSpec();

    // OpenAPI Version, Title Info, and Version Info validation
    apiSpec.openapi = document.getElementById("openapi").value.trim();
    const titleInfo = document.getElementById("titleInfo").value.trim();
    const versionInfo = document.getElementById("versionInfo").value.trim();

    if (!apiSpec.openapi || !titleInfo || !versionInfo) {
        if (!apiSpec.openapi) {
            // Se non corrisponde, evidenzia il campo di rosso
            document.getElementById("openapi").style.borderColor = 'red';
        } else {
            // Altrimenti, reimposta il colore del bordo
            document.getElementById("openapi").style.borderColor = '';
        }
        if (!titleInfo) {
            // Se non corrisponde, evidenzia il campo di rosso
            document.getElementById("titleInfo").style.borderColor = 'red';
        } else {
            // Altrimenti, reimposta il colore del bordo
            document.getElementById("titleInfo").style.borderColor = '';
        }
        if (!versionInfo) {
            // Se non corrisponde, evidenzia il campo di rosso
            document.getElementById("versionInfo").style.borderColor = 'red';
        } else {
            // Altrimenti, reimposta il colore del bordo
            document.getElementById("versionInfo").style.borderColor = '';
        }
        alert("OpenAPI Version, Title Info, and Version Info cannot be null");
        return;
    }

    apiSpec.info.title = titleInfo;
    apiSpec.info.description = document.getElementById("descriptionInfo").value.trim();
    apiSpec.info.termsOfService = document.getElementById("termsOfServiceInfo").value.trim();
    apiSpec.info.version = versionInfo;

    apiSpec.info.contact.name = document.getElementById("nameContact").value.trim();
    apiSpec.info.contact.url = document.getElementById("urlContact").value.trim();
    apiSpec.info.contact.email = document.getElementById("emailContact").value.trim();

    apiSpec.info.license.name = document.getElementById("nameLicense").value.trim();
    apiSpec.info.license.url = document.getElementById("urlLicense").value.trim();
    apiSpec.info.license.identifier = document.getElementById("identifier").value.trim();

    apiSpec.externalDocs.description = document.getElementById("externalDocsDescription").value.trim();
    apiSpec.externalDocs.url = document.getElementById("externalDocsUrl").value.trim();

    // Servers mapping
    serverKeyDescMap.forEach((data, value) => {
        const server = new Server();
        server.url = value;
        server.description = data;
        apiSpec.servers.push(server)
    });

    return apiSpec;
}

function handleContinueButton() {

    const openApiVersion = document.getElementById("openapi").value.trim();
    const titleInfo = document.getElementById("titleInfo").value.trim();
    const versionInfo = document.getElementById("versionInfo").value.trim();
    if (!openApiVersion || !titleInfo || !versionInfo) {
        alert("OpenAPI Version, Title Info and Version Info cannot be null");
        return;
    }

    if (!validateInputFields()) {
        alert("Some fields do not comply with the syntax.");
        return;
    }

    const apiSpec = buildApiSpec();

    // Creare un oggetto con i dati da inviare
    const data = {
        step: 'pojo',
        apiSpec: JSON.stringify(apiSpec)
    };

    // Eseguire la richiesta POST con Ajax
    $.ajax({
        type: 'POST',
        url: 'creazioneSpecifica',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            // Gestire la risposta dal server, se necessario
            window.location.href = 'schemaDefinition'
        },
        error: function (error) {
            console.error('Error: ', error);
            alert("Error while proceeding to the next step")
        }
    });
}


// Validazione dei campi
function validateInputFields() {

    // Campi di input da validare
    const fieldsToValidate = [
        { id: 'openapi', type: 'version' },
        { id: 'versionInfo', type: 'version' },
        { id: 'externalDocsUrl', type: 'url' },
        { id: 'termsOfServiceInfo', type: 'url' },
        { id: 'urlContact', type: 'url' },
        { id: 'emailContact', type: 'email' },
        { id: 'urlLicense', type: 'url' }
    ];

    let returnvalue = true;

    // Itera sui campi da validare
    fieldsToValidate.forEach(field => {
        const inputField = document.getElementById(field.id);
        const value = inputField.value.trim();
        // Se il campo non è vuoto
        if (value !== '') {
            // Verifica la corrispondenza con la regex
            if (!regex[field.type].test(value)) {
                returnvalue = false;
                // Se non corrisponde, evidenzia il campo di rosso
                inputField.style.borderColor = 'red';
            } else {
                // Altrimenti, reimposta il colore del bordo
                inputField.style.borderColor = '';
            }
        }
    });

    return returnvalue
}
