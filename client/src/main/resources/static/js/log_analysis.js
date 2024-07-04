let targetedEndpointsChart; // Variabile globale per il grafico
let temporalPatternsChart; // Variabile globale per il grafico dei pattern temporali

$(document).ready(function () {

    // Button functions
    $('#backButton').on('click', function () {
        window.history.back();
    });

    $('#downloadPDFButton').on('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const logs = JSON.parse(localStorage.getItem('logs'));

        // Title
        doc.setFontSize(18);
        doc.text('Deception Log Insights', 10, 22);

        // Overview Metrics
        let yOffset = renderOverviewMetrics(doc);

        // Attack Patterns Chart
        yOffset = renderChartToPDF(doc, 'Attack Patterns', 'attackPatternsChart', 10, yOffset);

        // Temporal Patterns Chart
        yOffset = renderTemporalPatternsChartToPDF(doc, 'Temporal Patterns', 'temporalPatternsChart', 10, yOffset);

        // Targeted Endpoints Chart
        yOffset = renderChartToPDF(doc, 'Targeted Endpoints', 'targetedEndpointsChart', 10, yOffset);

        // Suspicious IP Addresses List
        yOffset = renderListToPDF(doc, 'Suspicious IP Addresses', 'suspiciousIPsList', 10, yOffset);

        // Geo-Location Requests
        yOffset = renderListToPDF(doc, 'Geo-Location of Requests', 'geoLocationRequests', 10, yOffset);

        // JWT Token Attempts
        yOffset = renderJWTTokenAttempts(doc, logs, 10, yOffset);

        // XSS Attempts
        yOffset = renderXSSAttempts(doc, logs, 10, yOffset);

        // Command Executions
        yOffset = renderCommandExecutions(doc, logs, 10, yOffset);

        // Client Session Analysis
        yOffset = renderListToPDF(doc, 'Client Session Analysis', 'clientBehaviorAnalysis', 10, yOffset);

        // HTTP Headers Analysis
        yOffset = renderHTTPHeadersAnalysisToPDF(doc, 'HTTP Headers Analysis', 10, yOffset);

        // Save the PDF
        doc.save('log_insights.pdf');
    });

    function renderJWTTokenAttempts(doc, logs, xPos, yPos) {
        const jwtAttempts = logs.filter(log => log.requestURL.includes('auth/token'));
        const ipAttempts = {};

        jwtAttempts.forEach(attempt => {
            const IP = attempt.clientIPAddress || 'Unknown';
            if (attempt.queryParameters.includes("username") && attempt.queryParameters.includes("password")) {
                const username = attempt.queryParameters.split("\n")[0].substring(9).trim() || 'Unknown';
                const password = attempt.queryParameters.split("\n")[1].substring(9).trim() || 'Unknown';

                if (!ipAttempts[IP]) {
                    ipAttempts[IP] = {};
                }

                const userPassKey = `${username}:${password}`;
                if (!ipAttempts[IP][userPassKey]) {
                    ipAttempts[IP][userPassKey] = 0;
                }
                ipAttempts[IP][userPassKey]++;
            }
        });

        doc.setFontSize(14);
        doc.text("JWT Token Attempts", xPos, yPos);
        doc.setFontSize(10);

        let y = yPos + 10;
        for (const [IP, attempts] of Object.entries(ipAttempts)) {
            doc.text(`IP: ${IP}`, xPos, y);
            y += 7;
            for (const [userPassKey, count] of Object.entries(attempts)) {
                const [username, password] = userPassKey.split(':');
                doc.text(`Username: ${username}, Password: ${password}, Attempts: ${count}`, xPos + 10, y);
                y += 5;
            }
            y += 10;
        }

        const pageHeight = doc.internal.pageSize.height;
        const currentY = y + 10; // Adjust the final position

        if (currentY > pageHeight - 50) {
            doc.addPage();
            return 20; // Start from the top of the new page
        } else {
            return currentY + 10; // Add padding for the next content
        }
    }


    function renderXSSAttempts(doc, logs, xPos, yPos) {
        const xssAttempts = logs.filter(log => log.queryParameters && log.queryParameters.includes('<script>') && log.queryParameters.includes('</script>'));
        const ipAttempts = {};

        xssAttempts.forEach(attempt => {
            const IP = attempt.clientIPAddress || 'Unknown';
            const script = attempt.queryParameters.match(/<script>(.*?)<\/script>/)[1] || 'Unknown';

            if (!ipAttempts[IP]) {
                ipAttempts[IP] = {};
            }

            if (!ipAttempts[IP][script]) {
                ipAttempts[IP][script] = 0;
            }
            ipAttempts[IP][script]++;
        });

        doc.setFontSize(14);
        doc.text("XSS Attempts", xPos, yPos);
        doc.setFontSize(10);

        let y = yPos + 10;
        for (const [IP, scripts] of Object.entries(ipAttempts)) {
            doc.text(`IP: ${IP}`, xPos, y);
            y += 7;
            for (const [script, count] of Object.entries(scripts)) {
                doc.text(`Script: ${script}, Attempts: ${count}`, xPos + 10, y);
                y += 5;
            }
            y += 10;
        }

        const pageHeight = doc.internal.pageSize.height;
        const currentY = y + 10; // Adjust the final position

        if (currentY > pageHeight - 50) {
            doc.addPage();
            return 20; // Start from the top of the new page
        } else {
            return currentY + 10; // Add padding for the next content
        }
    }


    function renderCommandExecutions(doc, logs, xPos, yPos) {
        const commandExecutions = logs.filter(log => log.requestURL.includes('command-exec') && log.queryParameters.includes('command'));
        const ipAttempts = {};

        commandExecutions.forEach(exec => {
            const IP = exec.clientIPAddress || 'Unknown';
            const command = exec.queryParameters.split("command: ")[1] || 'Unknown';

            if (!ipAttempts[IP]) {
                ipAttempts[IP] = {};
            }

            if (!ipAttempts[IP][command]) {
                ipAttempts[IP][command] = 0;
            }
            ipAttempts[IP][command]++;
        });

        doc.setFontSize(14);
        doc.text("Command Executions Attempts", xPos, yPos);
        doc.setFontSize(10);
        let y = yPos + 10;
        for (const [IP, commands] of Object.entries(ipAttempts)) {
            doc.text(`IP: ${IP}`, xPos, y);
            y += 7;
            for (const [command, count] of Object.entries(commands)) {
                doc.text(`Command: ${command.replace("\n", "")}, Attempts: ${count}`, xPos + 10, y);
                y += 5;
            }
            y += 10;
        }

        const pageHeight = doc.internal.pageSize.height;
        const currentY = y + 10; // Adjust the final position

        if (currentY > pageHeight - 50) {
            doc.addPage();
            return 20; // Start from the top of the new page
        } else {
            return currentY + 10; // Add padding for the next content
        }
    }

    function renderOverviewMetrics(doc) {
        doc.setFontSize(16);
        doc.text('Overview', 10, 40);

        const totalLogs = $('#totalLogs').text();
        const uniqueIPs = $('#uniqueIPs').text();
        const targetedEndpoints = $('#targetedEndpoints').text();

        doc.setFontSize(12);
        doc.text(`Total Logs: ${totalLogs}`, 10, 50);
        doc.text(`Unique IPs: ${uniqueIPs}`, 10, 57);
        doc.text(`Targeted Endpoints: ${targetedEndpoints}`, 10, 64);

        // Check if content exceeds the page height and add a new page if necessary
        const pageHeight = doc.internal.pageSize.height;
        const currentY = doc.autoTable.previous.finalY || 80; // Starting yOffset

        if (currentY > pageHeight - 20) {
            doc.addPage();
            return 20; // Start from the top of the new page
        } else {
            return currentY; // Add padding for the next content
        }
    }

    function renderChartToPDF(doc, title, chartId, xPos, yPos) {
        doc.setFontSize(14);
        doc.text(title, xPos, yPos);

        const canvas = document.getElementById(chartId);
        const imgData = canvas.toDataURL('image/png');
        if (chartId === "targetedEndpointsChart") {
            doc.addImage(imgData, 'PNG', xPos + 15, yPos + 25, 170, 170);
        }
        else {
            doc.addImage(imgData, 'PNG', xPos + 15, yPos + 10, 160, 60);
        }

        // Check if content exceeds the page height and add a new page if necessary
        const pageHeight = doc.internal.pageSize.height;
        const currentY = doc.autoTable.previous.finalY || yPos + 80; // Starting yOffset

        if (currentY > pageHeight - 20 || chartId === "targetedEndpointsChart") {
            doc.addPage();
            return 20; // Start from the top of the new page
        } else {
            return currentY + 10; // Add padding for the next content
        }
    }

    function renderListToPDF(doc, title, listId, xPos, yPos) {
        doc.setFontSize(14);
        doc.text(title, xPos, yPos);

        doc.setFontSize(10);
        let y = yPos + 10;
        $(`#${listId} ul li`).each(function () {
            doc.text($(this).text(), xPos, y);
            y += 7;
        });

        // Check if content exceeds the page height and add a new page if necessary
        const pageHeight = doc.internal.pageSize.height;
        const currentY = doc.autoTable.previous.finalY || y + 10; // Starting yOffset

        if (currentY > pageHeight - 50) {
            doc.addPage();
            return 20; // Start from the top of the new page
        } else {
            return currentY + 10; // Add padding for the next content
        }
    }

// Function to render the Temporal Patterns chart with zoom to the PDF and return the new yOffset
    function renderTemporalPatternsChartToPDF(doc, title, chartId, xPos, yPos) {
        doc.setFontSize(14);
        doc.text(title, xPos, yPos);

        const canvas = document.getElementById(chartId);
        const imgData = canvas.toDataURL('image/png');

        // Adjust size and position to fit within the page
        const width = 180;
        const height = 100;
        const offsetY = 10;

        doc.addImage(imgData, 'PNG', xPos, yPos + offsetY, width, height, '', 'FAST');

        // Check if content exceeds the page height and add a new page if necessary
        const pageHeight = doc.internal.pageSize.height;
        const currentY = doc.autoTable.previous.finalY || yPos + 120; // Starting yOffset

        if (currentY > pageHeight - 20) {
            doc.addPage();
            return 20; // Start from the top of the new page
        } else {
            return currentY + 120; // Add padding for the next content
        }
    }

// Function to render HTTP Headers Analysis in the PDF and return the new yOffset
    function renderHTTPHeadersAnalysisToPDF(doc, title, xPos, yPos) {
        doc.setFontSize(14);
        doc.text(title, xPos, yPos);

        const userAgentData = "httpHeadersAnalysisUA";
        const authData = "httpHeadersAnalysisAuth";

        doc.setFontSize(12);
        doc.text('User-Agent Analysis:', xPos, yPos + 10);
        doc.setFontSize(10);

        let y = yPos + 17
        $(`#${userAgentData} ul li`).each(function () {
            let text = $(this).text();

            // Divide il testo in righe basate sulla larghezza massima disponibile (180)
            let textLines = doc.splitTextToSize(text, 180);

            // Stampa ciascuna riga del testo
            textLines.forEach(function (line) {
                doc.text(line, xPos, y);
                y += 7; // Spaziatura tra le righe
            });

        });

        // Calcola la posizione Y corrente e verifica se è necessaria una nuova pagina
        const pageHeight = y;
        const textHeight = y; // Altezza del testo dell'User-Agent

        let currentY = yPos + 30 + textHeight + 10; // 30 (dall'inizio del titolo) + altezza del testo + padding

        // Verifica se il contenuto supera l'altezza della pagina e aggiungi una nuova pagina se necessario
        if (currentY > pageHeight - 50) {
            doc.addPage();
            yPos = 20; // Resetta la posizione Y per iniziare dalla cima della nuova pagina
        } else {
            yPos = currentY; // Aggiorna la posizione Y corrente
        }

        // Aggiungi la sezione sull'autenticazione
        doc.setFontSize(12);
        doc.text('Authentication Analysis:', xPos, yPos + 10);
        doc.setFontSize(10);

        y = yPos + 17
        $(`#${authData} ul li`).each(function () {
            let text = $(this).text();

            // Divide il testo in righe basate sulla larghezza massima disponibile (180)
            let textLines = doc.splitTextToSize(text, 180);

            // Stampa ciascuna riga del testo
            textLines.forEach(function (line) {
                doc.text(line, xPos, y);
                y += 7; // Spaziatura tra le righe
            });

        });
        // Calcola la nuova posizione Y e verifica se è necessaria una nuova pagina
        const authTextHeight = y // Altezza del testo dell'autenticazione
        currentY = yPos + 30 + authTextHeight + 10; // 30 (dall'inizio del titolo) + altezza del testo + padding

        // Verifica nuovamente se è necessaria una nuova pagina
        if (currentY > pageHeight - 50) {
            doc.addPage();
            yPos = 20; // Resetta la posizione Y per iniziare dalla cima della nuova pagina
        } else {
            yPos = currentY; // Aggiorna la posizione Y corrente
        }

        // Restituisci la posizione Y finale per il successivo contenuto
        return yPos + 20; // Aggiungi un margine per il contenuto successivo
    }


    $('#temporalGroupBy').on('change', function() {
        const groupBy = $(this).val();
        updateTemporalPatterns(groupBy);
    });

    $('#limitHTTPHeadersUA').on('change', function() {
        const limit = parseInt($(this).val());
        updateHTTPHeadersAnalysisUA(limit);
    });

    $('#limitHTTPHeadersAuth').on('change', function() {
        const limit = parseInt($(this).val());
        updateHTTPHeadersAnalysisAuth(limit);
    });

    $('#limitAdminPageAccessAttempts').on('change', function() {
        const limit = parseInt($(this).val());
        updateInvalidAdminPageAccessAttempts(limit);
    });

    $('#limitendpoints').on('change', function() {
        const limit = parseInt($(this).val());
        updateTargetedEndpoints(limit);
    });

    $('#limitsuspiciousips').on('change', function() {
        const limit = parseInt($(this).val());
        updateSuspiciousIPs(limit);
    });

    $('#limitsessions').on('change', function() {
        const limit = parseInt($(this).val());
        updateSessions(limit);
    });

    loadLogs();
});

function loadLogs() {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        processLogs(logs);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}

function processLogs(logs) {
    $('#totalLogs').text(logs.length);
    $('#uniqueIPs').text(new Set(logs.map(log => log.clientIPAddress)).size);
    $('#targetedEndpoints').text(new Set(logs.map(log => log.requestURL)).size);

    const attackPatterns = calculateAttackPatterns(logs);
    const targetedEndpointsData = calculateTargetedEndpoints(logs);
    const suspiciousIPs = calculateSuspiciousIPs(logs);
    const temporalPatterns = calculateTemporalPatterns(logs);
    const httpHeadersAnalysisUA = analyzeHTTPHeadersUA(logs);
    const httpHeadersAnalysisAuth = analyzeHTTPHeadersAuth(logs);

    const geoLocationRequests = analyzeGeoLocation(logs);
    const clientBehaviorAnalysis = analyzeClientBehavior(logs);

    renderAttackPatternsChart(attackPatterns);
    renderTargetedEndpointsChart(targetedEndpointsData);
    renderSuspiciousIPsList(suspiciousIPs);
    renderTemporalPatternsChart(temporalPatterns);
    renderHTTPHeadersAnalysisUA(httpHeadersAnalysisUA);
    renderHTTPHeadersAnalysisAuth(httpHeadersAnalysisAuth);
    renderGeoLocationRequests(geoLocationRequests);
    renderClientBehaviorAnalysis(clientBehaviorAnalysis);

    renderJWTTokenAttempts(logs);
    renderXSSAttempts(logs);
    renderCommandExecutions(logs);
    renderAdminPageAccessAttempts(logs);
}


// Calculating data functions
function calculateAttackPatterns(logs) {
    const patternCounts = {
        'SQL Injection': 0,
        'XSS': 0,
        'Remote Code Execution': 0,
        'Directory Traversal': 0,
        'Missing Admin Authentication': 0
    };

    logs.forEach(log => {
        const queryParameters = log.queryParameters || '';
        const requestURL = log.requestURL || '';

        if (requestURL.includes('users-info') && (queryParameters.includes("searchTerm: ") && queryParameters.split("searchTerm: ")[1].trim().includes(" "))) {
            patternCounts['SQL Injection']++;
        }
        if (queryParameters.includes('<script>')) {
            patternCounts['XSS']++;
        }
        if (queryParameters.includes('command')) {
            patternCounts['Remote Code Execution']++;
        }
        if (queryParameters.includes('filePath')) {
            patternCounts['Directory Traversal']++;
        }
        if (requestURL.includes('admin/login') && queryParameters.includes("error")) {
            patternCounts['Missing Admin Authentication']++;
        }
    });

    return {
        labels: Object.keys(patternCounts),
        data: Object.values(patternCounts)
    };
}

function calculateTargetedEndpoints(logs, limit = 10) {
    const endpointCounts = {};

    logs.forEach(log => {
        const requestURL = log.requestURL || 'Unknown';
        endpointCounts[requestURL] = (endpointCounts[requestURL] || 0) + 1;
    });

    // Convert the endpointCounts object to an array of [endpoint, count] pairs
    const sortedEndpoints = Object.entries(endpointCounts).sort((a, b) => b[1] - a[1]);

    // Take the top X elements
    const topEndpoints = sortedEndpoints.slice(0, limit);

    // Convert back to an object for use in the chart
    const labels = topEndpoints.map(item => item[0]);
    const data = topEndpoints.map(item => item[1]);

    return {
        labels: labels,
        data: data
    };
}

function calculateSuspiciousIPs(logs, limit = 10) {
    const ipCounts = {};

    logs.forEach(log => {
        if (ipCounts[log.clientIPAddress]) {
            ipCounts[log.clientIPAddress]++;
        } else {
            ipCounts[log.clientIPAddress] = 1;
        }
    });

    return Object.entries(ipCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .reduce((acc, [ip, count]) => {
            acc[ip] = count;
            return acc;
        }, {});
}

function calculateTemporalPatterns(logs, groupBy = 'hour') {
    const patterns = {};

    logs.forEach(log => {
        const date = new Date(log.timestamp);
        let key;
        if (groupBy === 'hour') {
            key = `${date.toDateString()} ${date.getHours()}:00`;
        } else if (groupBy === 'day') {
            key = date.toDateString();
        } else {
            key = date.toISOString();
        }

        if (patterns[key]) {
            patterns[key]++;
        } else {
            patterns[key] = 1;
        }
    });

    return patterns;
}

function analyzeHTTPHeadersUA(logs, limit = 10) {
    const userAgentCounts = {};

    logs.forEach(log => {
        const userAgent = log.headers_useragent || 'Unknown';
        userAgentCounts[userAgent] = (userAgentCounts[userAgent] || 0) + 1;
    });

    return Object.entries(userAgentCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
}

function analyzeHTTPHeadersAuth(logs, limit = 10) {
    const authorizationCounts = {};

    logs.forEach(log => {
        const authorization = log.headers_authorization || 'Unknown';
        authorizationCounts[authorization] = (authorizationCounts[authorization] || 0) + 1;
    });

    return Object.entries(authorizationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
}

function analyzeGeoLocation(logs) {
    const geoCounts = {};

    logs.forEach(log => {
        const geoLocation = getGeoLocationFromIP(log.clientIPAddress);
        geoCounts[geoLocation] = (geoCounts[geoLocation] || 0) + 1;
    });

    return geoCounts;
}

function getGeoLocationFromIP(ip) {
    // Dummy function, implement actual geolocation logic
    return "Unknown";
}

function analyzeClientBehavior(logs, limit = 10) {
    const sessionCounts = {};

    logs.forEach(log => {
        const sessionID = log.cookies && log.cookies.match(/JSESSIONID=([^;]+)/) ? log.cookies.match(/JSESSIONID=([^;]+)/)[1] : 'No Session';
        sessionCounts[sessionID] = (sessionCounts[sessionID] || 0) + 1;
    });

    const sortedSessions = Object.entries(sessionCounts).sort((a, b) => b[1] - a[1]);
    return sortedSessions.slice(0, limit).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
}


// Rendering functions
function renderAttackPatternsChart(data) {
    const ctx = document.getElementById('attackPatternsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Number of Attacks',
                data: data.data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderTargetedEndpointsChart(data) {
    const ctx = document.getElementById('targetedEndpointsChart').getContext('2d');
    if (targetedEndpointsChart) {
        targetedEndpointsChart.destroy();
    }
    targetedEndpointsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Number of Hits',
                data: data.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
        }
    });
}

function renderSuspiciousIPsList(data) {
    const list = $('#suspiciousIPsList');
    list.empty();
    const ul = $('<ul></ul>');
    Object.entries(data).forEach(([ip, count]) => {
        ul.append(`<li>${ip}: ${count} attempts</li>`);
    });
    list.append(ul);
}

function renderTemporalPatternsChart(data, groupBy = 'hour') {
    const ctx = document.getElementById('temporalPatternsChart').getContext('2d');
    if (temporalPatternsChart) {
        temporalPatternsChart.destroy(); // Distruggi il grafico esistente prima di crearne uno nuovo
    }
    temporalPatternsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: `Logs per ${groupBy}`,
                data: Object.values(data),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x'
                    }
                }
            }
        }
    });
}

function renderHTTPHeadersAnalysisUA(data) {
    let userAgentHtml = '<ul>';
    Object.entries(data).forEach(([ua, count]) => {
        userAgentHtml += `<li>${ua}: ${count}</li>`;
    });
    userAgentHtml += '</ul>';


    $('#httpHeadersAnalysisUA').html(userAgentHtml);
}

function renderHTTPHeadersAnalysisAuth(data) {
    let authorizationHtml = '<ul>';
    Object.entries(data).forEach(([auth, count]) => {
        authorizationHtml += `<li>${auth}: ${count}</li>`;
    });
    authorizationHtml += '</ul>';

    $('#httpHeadersAnalysisAuth').html(authorizationHtml);
}

function renderGeoLocationRequests(data) {
    let geoHtml = '<ul>';
    Object.keys(data).forEach(location => {
        geoHtml += `<li>${location}: ${data[location]}</li>`;
    });
    geoHtml += '</ul>';
    $('#geoLocationRequests').html(geoHtml);
}

function renderClientBehaviorAnalysis(data) {
    let behaviorHtml = '<ul>';
    Object.keys(data).forEach(session => {
        behaviorHtml += `<li>Session ${session}: ${data[session]}</li>`;
    });
    behaviorHtml += '</ul>';
    $('#clientBehaviorAnalysis').html(behaviorHtml);
}

function renderJWTTokenAttempts(logs) {
    const jwtAttempts = logs.filter(log => log.requestURL.includes('auth/token'));
    const ipAttempts = {};

    jwtAttempts.forEach(attempt => {
        const IP = attempt.clientIPAddress || 'Unknown';
        if (attempt.queryParameters.includes("username") && attempt.queryParameters.includes("password")){
            const username = attempt.queryParameters.split("\n")[0].substring(9).trim() || 'Unknown';
            const password = attempt.queryParameters.split("\n")[1].substring(9).trim() || 'Unknown';

            if (!ipAttempts[IP]) {
                ipAttempts[IP] = {};
            }

            const userPassKey = `${username}:${password}`;
            if (!ipAttempts[IP][userPassKey]) {
                ipAttempts[IP][userPassKey] = 0;
            }
            ipAttempts[IP][userPassKey]++;
        }

    });

    let html = '<ul>';
    for (const [IP, attempts] of Object.entries(ipAttempts)) {
        html += `<li>IP: ${IP}<ul>`;
        for (const [userPassKey, count] of Object.entries(attempts)) {
            const [username, password] = userPassKey.split(':');
            html += `<li>Username: ${username}, Password: ${password}, Attempts: ${count}</li>`;
        }
        html += `</ul></li>`;
    }
    html += '</ul>';

    $('#jwtTokenAttempts').html(html);
}

function renderXSSAttempts(logs) {
    const xssAttempts = logs.filter(log => log.queryParameters && log.queryParameters.includes('<script>') && log.queryParameters.includes('</script>'));
    const ipAttempts = {};

    xssAttempts.forEach(attempt => {
        const IP = attempt.clientIPAddress || 'Unknown';
        const script = attempt.queryParameters.match(/<script>(.*?)<\/script>/)[1] || 'Unknown';

        if (!ipAttempts[IP]) {
            ipAttempts[IP] = {};
        }

        if (!ipAttempts[IP][script]) {
            ipAttempts[IP][script] = 0;
        }
        ipAttempts[IP][script]++;
    });

    let html = '<ul>';
    for (const [IP, scripts] of Object.entries(ipAttempts)) {
        html += `<li>IP: ${IP}<ul>`;
        for (const [script, count] of Object.entries(scripts)) {
            html += `<li>Script: ${script}, Attempts: ${count}</li>`;
        }
        html += `</ul></li>`;
    }
    html += '</ul>';

    $('#xssAttempts').html(html);
}

function renderCommandExecutions(logs) {
    const commandExecutions = logs.filter(log => log.requestURL.includes('command-exec') && log.queryParameters.includes('command'));
    const ipAttempts = {};

    commandExecutions.forEach(exec => {
        const IP = exec.clientIPAddress || 'Unknown';
        const command = exec.queryParameters.split("command: ")[1] || 'Unknown';

        if (!ipAttempts[IP]) {
            ipAttempts[IP] = {};
        }

        if (!ipAttempts[IP][command]) {
            ipAttempts[IP][command] = 0;
        }
        ipAttempts[IP][command]++;
    });

    let html = '<ul>';
    for (const [IP, commands] of Object.entries(ipAttempts)) {
        html += `<li>IP: ${IP}<ul>`;
        for (const [command, count] of Object.entries(commands)) {
            html += `<li>Command: ${command}, Attempts: ${count}</li>`;
        }
        html += `</ul></li>`;
    }
    html += '</ul>';

    $('#commandExecutions').html(html);
}

function renderAdminPageAccessAttempts(logs) {
    const adminAccessAttempts = logs.filter(log => log.requestURL.includes('admin/login') && log.queryParameters.includes("error"));
    const ipAttempts = {};

    adminAccessAttempts.forEach(attempt => {
        const IP = attempt.clientIPAddress || 'Unknown';
        if (!ipAttempts[IP]) {
            ipAttempts[IP] = 0;
        }
        ipAttempts[IP]++;
    });

    let html = '<ul>';
    for (const [IP, count] of Object.entries(ipAttempts)) {
        html += `<li>IP: ${IP}, Attempts: ${count}</li>`;
    }
    html += '</ul>';

    $('#invalidAdminPageAccessAttempts').html(html);
}


// Update functions
function updateTargetedEndpoints(limit) {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        const targetedEndpointsData = calculateTargetedEndpoints(logs, limit);
        renderTargetedEndpointsChart(targetedEndpointsData);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}

function updateSuspiciousIPs(limit) {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        const suspiciousIPsData = calculateSuspiciousIPs(logs, limit);
        renderSuspiciousIPsList(suspiciousIPsData);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}

function updateTemporalPatterns(groupBy) {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        const temporalPatternsData = calculateTemporalPatterns(logs, groupBy);
        renderTemporalPatternsChart(temporalPatternsData, groupBy);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}

function updateSessions(limit) {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        const clientBehaviorAnalysis = analyzeClientBehavior(logs, limit);
        renderClientBehaviorAnalysis(clientBehaviorAnalysis);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}

function updateInvalidAdminPageAccessAttempts(limit) {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        renderAdminPageAccessAttempts(logs);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}

function updateHTTPHeadersAnalysisUA(limit) {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        const httpHeadersAnalysisData = analyzeHTTPHeadersUA(logs, limit);
        renderHTTPHeadersAnalysisUA(httpHeadersAnalysisData);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}

function updateHTTPHeadersAnalysisAuth(limit) {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        const httpHeadersAnalysisData = analyzeHTTPHeadersAuth(logs, limit);
        renderHTTPHeadersAnalysisAuth(httpHeadersAnalysisData);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}
