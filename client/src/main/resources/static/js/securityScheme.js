document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("type").addEventListener('change', function () {
        const typeValue = this.value.toLowerCase();
        if (typeValue === 'oauth2') {
            document.getElementById('flow-section').style.display = 'flex';
        } else {
            document.getElementById('flow-section').style.display = 'none';
        }
    });

    // Mostra la dialog e aggiunge la classe dialog-open al body
    $('#import').click(function() {
        $('#dialogimport').show();
        $('body').addClass('dialog-open');
    });

    $('#save').click(function() {
        saveConfig();
    });

    $('#reset').click(function() {
        const confirmSave = window.confirm('Svuotare tutti i campi?');
        if (confirmSave) {
            $('input[type="text"]').val('');
        }
    });

    // Chiudi la dialog se si clicca al di fuori di essa
    $(document).mouseup(function(e) {
        var dialog = $('#dialogimport');
        // Se il click non è all'interno della dialog o del pulsante "Import", chiudi la dialog
        if (!dialog.is(e.target) && dialog.has(e.target).length === 0 && !$('#import').is(e.target)) {
            dialog.hide();
            $('body').removeClass('dialog-open');
        }
    });
});

function parseScopes(scopesString) {
    const scopesArray = scopesString.split(',');
    const scopesMap = new Map();
    for (const scope of scopesArray) {
        const [key, value] = scope.split(':').map(part => part.trim());
        scopesMap.set(key, value);
    }
    return scopesMap;
}

function mapToString(scopesMap) {
    if (scopesMap === {}) {
        return '';
    }
    let formattedString = '';
    for (const [key, value] of Object.entries(scopesMap)) {
        formattedString += `${key}: ${value}, `;
    }
    // Rimuovi l'ultima virgola e lo spazio vuoto aggiunti in più
    formattedString = formattedString.slice(0, -2);
    return formattedString;
}

function buildSecurityScheme() {
    const type = $('#type').val();
    const description = $('#description').val();
    const name = $('#name').val();
    const inValue = $('#in').val();
    const scheme = $('#scheme').val();
    const bearerFormat = $('#bearerFormat').val();
    const openIdConnectUrl = $('#openIdConnectUrl').val();

    let flows = null
    if (type === 'oauth2') {
        // Leggi i valori dei flussi OAuth
        const implicitAuthorizationUrl = $('#authorizationUrlImplicit').val();
        const implicitRefreshUrl = $('#refreshUrlImplicit').val();
        const implicitScopes = parseScopes($('#scopesImplicit').val());
        const implicitFlow = new OAuthFlow(implicitAuthorizationUrl, null, implicitRefreshUrl, implicitScopes);

        const authorizationCodeAuthorizationUrl = $('#authorizationUrlAuthCode').val();
        const authorizationCodeRefreshUrl = $('#refreshUrlAuthCode').val();
        const authorizationCodeScopes = parseScopes($('#scopesAuthCode').val())
        const tokenUrlAuthCode = $('#tokenUrlAuthCode').val();
        const authorizationCodeFlow = new OAuthFlow(authorizationCodeAuthorizationUrl, tokenUrlAuthCode, authorizationCodeRefreshUrl, authorizationCodeScopes);

        const tokenUrlClient = $('#tokenUrlClient').val();
        const refreshUrlClient = $('#refreshUrlClient').val();
        const clientCredentialsScopes = parseScopes($('#scopesClient').val())
        const clientCredentialsFlow = new OAuthFlow(null, tokenUrlClient, refreshUrlClient, clientCredentialsScopes);

        const tokenUrlPass = $('#tokenUrlPass').val();
        const refreshUrlPass = $('#refreshUrlPass').val();
        const passwordScopes = parseScopes($('#scopesPass').val());
        const passwordFlow = new OAuthFlow(null, tokenUrlPass, refreshUrlPass, passwordScopes);

        // Converti le mappe in oggetti JavaScript
        const implicitFlowObj = {
            authorizationUrl: implicitAuthorizationUrl,
            tokenUrl: null,
            refreshUrl: implicitRefreshUrl,
            scopes: Object.fromEntries(implicitScopes.entries())
        };

        const authorizationCodeFlowObj = {
            authorizationUrl: authorizationCodeAuthorizationUrl,
            tokenUrl: tokenUrlAuthCode,
            refreshUrl: authorizationCodeRefreshUrl,
            scopes: Object.fromEntries(authorizationCodeScopes.entries())
        };

        const clientCredentialsFlowObj = {
            authorizationUrl: null,
            tokenUrl: tokenUrlClient,
            refreshUrl: refreshUrlClient,
            scopes: Object.fromEntries(clientCredentialsScopes.entries())
        };

        const passwordFlowObj = {
            authorizationUrl: null,
            tokenUrl: tokenUrlPass,
            refreshUrl: refreshUrlPass,
            scopes: Object.fromEntries(passwordScopes.entries())
        };

        // Crea un'istanza di OAuthFlows
        flows = new OAuthFlows(authorizationCodeFlowObj, implicitFlowObj, passwordFlowObj, clientCredentialsFlowObj);

    }
    // Crea e restituisci un'istanza di SecurityScheme
    return new SecurityScheme(type, description, name, inValue, scheme, bearerFormat, openIdConnectUrl, flows);
}


function saveConfig() {
    var userInput = prompt("Inserisci il nome con cui salvare la configurazione");

    // Controlla se l'utente ha inserito un valore
    if (userInput !== null) {
        const securityScheme = buildSecurityScheme();

        // Creare un oggetto con i dati da inviare
        var data = {
            filename: userInput,
            securityScheme: JSON.stringify(securityScheme)
        };

        // Eseguire la richiesta POST con Ajax
        $.ajax({
            type: 'POST',
            url: 'setSecurityScheme',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                console.log(response)
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    } else {
        // Se l'utente ha premuto Annulla, stampa un messaggio nella console del browser
        console.log("Operazione annullata dall'utente.");
    }
}

function fillValues(selectedOption) {

    $.ajax({
        type: 'POST',
        url: 'getSecurityScheme',
        contentType: 'application/json',
        data: selectedOption,
        success: function (response) {

            const securityScheme = JSON.parse(response)
            $('#type').val(securityScheme.type || '');
            $('#description').val(securityScheme.description || '');
            $('#name').val(securityScheme.name || '');
            $('#in').val(securityScheme.in || '');
            $('#scheme').val(securityScheme.scheme || '');
            $('#bearerFormat').val(securityScheme.bearerFormat || '');
            $('#openIdConnectUrl').val(securityScheme.openIdConnectUrl || '');

            if (securityScheme.type === 'oauth2') {
                document.getElementById('flow-section').style.display = 'flex';
            } else {
                document.getElementById('flow-section').style.display = 'none';
            }
            // Popola i campi dei flussi OAuth
            if (securityScheme.flows) {
                $('#authorizationUrlImplicit').val(securityScheme.flows.implicit.authorizationUrl || '');
                $('#refreshUrlImplicit').val(securityScheme.flows.implicit.refreshUrl || '');
                $('#scopesImplicit').val(mapToString(securityScheme.flows.implicit.scopes) || '');

                $('#authorizationUrlAuthCode').val(securityScheme.flows.authorizationCode.authorizationUrl || '');
                $('#refreshUrlAuthCode').val(securityScheme.flows.authorizationCode.refreshUrl || '');
                $('#scopesAuthCode').val(mapToString(securityScheme.flows.authorizationCode.scopes) || '');
                $('#tokenUrlAuthCode').val(securityScheme.flows.authorizationCode.tokenUrl || '');

                $('#tokenUrlClient').val(securityScheme.flows.clientCredentials.tokenUrl || '');
                $('#refreshUrlClient').val(securityScheme.flows.clientCredentials.refreshUrl || '');
                $('#scopesClient').val(mapToString(securityScheme.flows.clientCredentials.scopes) || '');

                $('#tokenUrlPass').val(securityScheme.flows.password.tokenUrl || '');
                $('#refreshUrlPass').val(securityScheme.flows.password.refreshUrl || '');
                $('#scopesPass').val(mapToString(securityScheme.flows.password.scopes) || '');
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });

}

function confirmSelection() {
    var selectedOption = $('#selectOption').val();
    if (selectedOption === null || selectedOption === "") {
        alert("Si prega di selezionare una configurazione");
        return;
    }
    // Esegui le azioni desiderate con l'opzione selezionata
    console.log("Option selected:", selectedOption);
    fillValues(selectedOption)
    // Chiudi la dialog
    $('#dialogimport').hide();
    $('body').removeClass('dialog-open');
}

function handleContinueButton() {
    const securityScheme = buildSecurityScheme();

    // Creare un oggetto con i dati da inviare
    var data = {
        step: 'paths',
        securityScheme: JSON.stringify(securityScheme)
    };

    // Eseguire la richiesta POST con Ajax
    $.ajax({
        type: 'POST',
        url: 'creazioneSpecifica',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            // Gestire la risposta dal server, se necessario
            window.location.href = 'pathsDefinition'
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}