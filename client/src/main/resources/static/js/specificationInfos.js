const serverKeyDescMap = new Map();
function addServer() {
    const serverUrl = document.getElementById('serverUrl');
    const serverUrlValue = serverUrl.value.trim();
    if (isEmptyString(serverUrlValue)) {
        alert('Il campo "url" di un server non può essere vuoto.');
        return;
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

function handleContinueButton() {

    const apiSpec = new ApiSpec();

    // OpenAPI Version, Title Info, and Version Info validation
    apiSpec.openapi = document.getElementById("openapi").value.trim();
    const titleInfo = document.getElementById("titleInfo").value.trim();
    const versionInfo = document.getElementById("versionInfo").value.trim();

    if (!apiSpec.openapi || !titleInfo || !versionInfo) {
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

    apiSpec.externalDocs.description = document.getElementById("externalDocsDescription").value.trim();
    apiSpec.externalDocs.url = document.getElementById("externalDocsUrl").value.trim();

    // Servers mapping
    serverKeyDescMap.forEach((data, value) => {
        const server = new Server();
        server.url = value;
        server.description = data;
        apiSpec.servers.push(server)
    });

    // Creare un oggetto con i dati da inviare
    var data = {
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
            console.error('Error:', error);
        }
    });
}

