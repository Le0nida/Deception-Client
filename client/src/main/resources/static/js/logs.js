// Variabile per memorizzare i log recuperati
let retrievedLogs = null;

$(document).ready(function () {

    $('#getlogs').click(function() {
        getLogsFromServer();
    });

    $('#reset').click(function() {
        const confirmSave = window.confirm('Empty all fields?');
        if (confirmSave) {
            resetFormFields();
        }
    });

    $('#downloadLogs').on('click', function () {
        downloadLogs(retrievedLogs);
    });

    $('#getInsights').on('click', function () {
        // Memorizza i log in localStorage per l'accesso nella dashboard
        localStorage.setItem('logs', JSON.stringify(retrievedLogs));
        window.location.href = '/log_analysis'; // La pagina della dashboard di analisi
    });
});


function getLogsFromServer() {
    let urlLog = document.getElementById("urlInput").value;
    const httpRequestLog = createClass();

    if (urlLog.endsWith("/")) {
        urlLog = urlLog + 'logs'
    }
    else {
        urlLog = urlLog + '/logs'
    }

    const datiDaInviare = {
        urlLog: urlLog,
        logRequest: JSON.stringify(httpRequestLog)
    };

    $.ajax({
        type: 'POST',
        url: '/getLogs',
        contentType: 'application/json',
        data: JSON.stringify(datiDaInviare),
        success: function (response) {
            if (response.message === "OK") {
                retrievedLogs = response.logs; // Assumi che i log siano in response.logs
                $('#downloadLogs').prop('disabled', false).removeClass('disabled-btn').addClass('enabled-btn');
                $('#getInsights').prop('disabled', false).removeClass('disabled-btn').addClass('enabled-btn');
                alert("Logs retrieved succesfully!")
            } else {
                alert(response.message);
            }
        },
        error: function (error) {
            console.error('Error: ', error);
            alert("Error retrieving logs");
        }
    });
}


function downloadLogs(logs) {
    // Verifica se il messaggio nella risposta è "OK"
    if (logs) {
        // Converti la lista di logs in formato JSON
        var logsJSON = JSON.stringify(logs, null, 2);

        // Crea un oggetto Blob contenente il JSON
        var blob = new Blob([logsJSON], { type: 'text/plain' });

        // Crea un URL oggetto temporaneo per il Blob
        var url = window.URL.createObjectURL(blob);

        // Crea un elemento link per avviare il download
        var a = document.createElement('a');
        a.href = url;
        a.download = 'logs.json';

        // Aggiungi il link all'elemento body e fai clic su di esso
        document.body.appendChild(a);
        a.click();

        // Rimuovi il link dall'elemento body dopo il download
        document.body.removeChild(a);

        // Rilascia l'URL oggetto
        window.URL.revokeObjectURL(url);
    } else {
        alert('Logs list is empty')
    }
}

function resetFormFields() {
    const excludedFields = ['urlInput', 'tokenInput'];

    // Trova tutti gli elementi di input nel documento
    const inputFields = document.querySelectorAll('input');

    // Itera su tutti gli elementi di input
    inputFields.forEach(function(input) {
        // Verifica se l'ID dell'elemento non è incluso nell'elenco degli esclusi
        if (!excludedFields.includes(input.id)) {
            // Resetta il valore dell'elemento
            input.value = '';
        }
    });

}

function createClass() {
    // Recupera i valori dai campi del modulo
    const date = document.getElementById("date").value || '';
    const time = document.getElementById("time").value || '';
    const httpMethod = document.getElementById("httpMethod").value;
    const requestURL = document.getElementById("requestURL").value;
    const headers_host = document.getElementById("headers_host").value;
    const headers_useragent = document.getElementById("headers_useragent").value;
    const headers_contenttype = document.getElementById("headers_contenttype").value;
    const headers_acccept = document.getElementById("headers_acccept").value;
    const headers_authorization = document.getElementById("headers_authorization").value;
    const queryParameters = document.getElementById("queryParameters").value;
    const requestBody = document.getElementById("requestBody").value;
    const clientIPAddress = document.getElementById("clientIPAddress").value;
    const clientPort = document.getElementById("clientPort").value;
    const protocol = document.getElementById("protocol").value;
    const authenticationType = document.getElementById("authenticationType").value;
    const acceptedContentTypes = document.getElementById("acceptedContentTypes").value;
    const preferredLanguage = document.getElementById("preferredLanguage").value;
    const acceptedCompressionTypes = document.getElementById("acceptedCompressionTypes").value;
    const acceptedConnectionTypes = document.getElementById("acceptedConnectionTypes").value;
    const cookies = document.getElementById("cookies").value;

    // Definisci la classe HttpRequestLog
    const HttpRequestLog = function(timestamp, httpMethod, requestURL, headers_host, headers_useragent,
                                  headers_contenttype, headers_acccept, headers_authorization,
                                  queryParameters, requestBody, clientIPAddress, clientPort,
                                  protocol, authenticationType, acceptedContentTypes,
                                  preferredLanguage, acceptedCompressionTypes, acceptedConnectionTypes,
                                  cookies) {
        this.timestamp = timestamp;
        this.httpMethod = httpMethod;
        this.requestURL = requestURL;
        this.headers_host = headers_host;
        this.headers_useragent = headers_useragent;
        this.headers_contenttype = headers_contenttype;
        this.headers_acccept = headers_acccept;
        this.headers_authorization = headers_authorization;
        this.queryParameters = queryParameters;
        this.requestBody = requestBody;
        this.clientIPAddress = clientIPAddress;
        this.clientPort = clientPort;
        this.protocol = protocol;
        this.authenticationType = authenticationType;
        this.acceptedContentTypes = acceptedContentTypes;
        this.preferredLanguage = preferredLanguage;
        this.acceptedCompressionTypes = acceptedCompressionTypes;
        this.acceptedConnectionTypes = acceptedConnectionTypes;
        this.cookies = cookies;
    };

    let timestamp = ''
    if (date !== '') {
        if (time !== '') {
            timestamp = date + "T" + time + ":00"
        }
        else {
            timestamp = date + "T00:00:00"
        }

    }

    // Crea un'istanza della classe HttpRequestLog
    const httpRequestLogObject = new HttpRequestLog(timestamp, httpMethod, requestURL, headers_host,
        headers_useragent, headers_contenttype, headers_acccept, headers_authorization, queryParameters,
        requestBody, clientIPAddress, clientPort, protocol, authenticationType, acceptedContentTypes,
        preferredLanguage, acceptedCompressionTypes, acceptedConnectionTypes, cookies);

    const LogRequest = function(token, filter) {
        this.token = token;
        this.filter = filter;
    }

    const token = document.getElementById("tokenInput").value;

    return new LogRequest(token, httpRequestLogObject);
}