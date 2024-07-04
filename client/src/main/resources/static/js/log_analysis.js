let targetedEndpointsChart; // Variabile globale per il grafico


$(document).ready(function () {
    function loadLogs() {
        const logs = JSON.parse(localStorage.getItem('logs'));
        if (logs) {
            processLogs(logs);
        } else {
            console.error('Nessun log trovato in localStorage.');
        }
    }

    function processLogs(logs) {
        const totalLogs = logs.length;
        const uniqueIPs = new Set(logs.map(log => log.clientIPAddress)).size;
        const targetedEndpoints = new Set(logs.map(log => log.requestURL)).size;

        $('#totalLogs').text(totalLogs);
        $('#uniqueIPs').text(uniqueIPs);
        $('#targetedEndpoints').text(targetedEndpoints);

        const attackPatterns = calculateAttackPatterns(logs);
        const targetedEndpointsData = calculateTargetedEndpoints(logs, 10);
        const suspiciousIPs = calculateSuspiciousIPs(logs);
        const temporalPatterns = calculateTemporalPatterns(logs);
        const httpHeadersAnalysis = analyzeHTTPHeaders(logs);
        const geoLocationRequests = analyzeGeoLocation(logs);
        const clientBehaviorAnalysis = analyzeClientBehavior(logs);

        renderAttackPatternsChart(attackPatterns);
        renderTargetedEndpointsChart(targetedEndpointsData);
        renderSuspiciousIPsList(suspiciousIPs);
        renderTemporalPatternsChart(temporalPatterns);
        renderHTTPHeadersAnalysis(httpHeadersAnalysis);
        renderGeoLocationRequests(geoLocationRequests);
        renderClientBehaviorAnalysis(clientBehaviorAnalysis);

        renderJWTTokenAttempts(logs);
        renderXSSAttempts(logs);
        renderCommandExecutions(logs);
        renderAdminPageAccessAttempts(logs);
    }

    // Button functions
    $('#backButton').on('click', function () {
        window.history.back();
    });

    $('#downloadPDFButton').on('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text('Deception Log Insights', 10, 10);
        doc.text('Total Logs: ' + $('#totalLogs').text(), 10, 20);
        doc.text('Unique IPs: ' + $('#uniqueIPs').text(), 10, 30);
        doc.text('Targeted Endpoints: ' + $('#targetedEndpoints').text(), 10, 40);

        doc.text('Attack Patterns:', 10, 50);
        const attackPatternsChart = document.getElementById('attackPatternsChart');
        const attackPatternsImg = attackPatternsChart.toDataURL('image/png');
        doc.addImage(attackPatternsImg, 'PNG', 10, 60, 180, 60);

        doc.text('Targeted Endpoints:', 10, 130);
        const targetedEndpointsChart = document.getElementById('targetedEndpointsChart');
        const targetedEndpointsImg = targetedEndpointsChart.toDataURL('image/png');
        doc.addImage(targetedEndpointsImg, 'PNG', 10, 140, 180, 60);

        doc.text('Suspicious IP Addresses:', 10, 210);
        let y = 220;
        $('#suspiciousIPsList ul li').each(function () {
            doc.text($(this).text(), 10, y);
            y += 10;
        });

        doc.save('log_insights.pdf');
    });

    loadLogs();

});

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

function calculateTargetedEndpoints(logs, limit) {
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


function calculateSuspiciousIPs(logs) {
    const ipCounts = {};

    logs.forEach(log => {
        const clientIPAddress = log.clientIPAddress || 'Unknown';
        ipCounts[clientIPAddress] = (ipCounts[clientIPAddress] || 0) + 1;
    });

    return Object.keys(ipCounts).sort((a, b) => ipCounts[b] - ipCounts[a]).slice(0, 10); // Top 10 frequent IPs
}

function calculateTemporalPatterns(logs) {
    const dateCounts = {};

    logs.forEach(log => {
        const date = new Date(log.timestamp).toLocaleDateString();
        dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const labels = Object.keys(dateCounts);
    const data = Object.values(dateCounts);

    return {
        labels: labels,
        data: data
    };
}

function analyzeHTTPHeaders(logs) {
    const userAgentCounts = {};
    const authorizationCounts = {};

    logs.forEach(log => {
        const userAgent = log.headers_useragent || 'Unknown';
        const authorization = log.headers_authorization || 'Unknown';
        userAgentCounts[userAgent] = (userAgentCounts[userAgent] || 0) + 1;
        authorizationCounts[authorization] = (authorizationCounts[authorization] || 0) + 1;
    });

    return {
        userAgentCounts: userAgentCounts,
        authorizationCounts: authorizationCounts
    };
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

function analyzeClientBehavior(logs) {
    const sessionCounts = {};

    logs.forEach(log => {
        const sessionID = log.cookies && log.cookies.match(/JSESSIONID=([^;]+)/) ? log.cookies.match(/JSESSIONID=([^;]+)/)[1] : 'No Session';
        sessionCounts[sessionID] = (sessionCounts[sessionID] || 0) + 1;
    });

    return sessionCounts;
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


function renderSuspiciousIPsList(ips) {
    let suspiciousIPsHtml = '<ul>';
    ips.forEach(ip => {
        suspiciousIPsHtml += `<li>${ip}</li>`;
    });
    suspiciousIPsHtml += '</ul>';
    $('#suspiciousIPsList').html(suspiciousIPsHtml);
}

function renderTemporalPatternsChart(data) {
    const ctx = document.getElementById('temporalPatternsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Number of Logs',
                data: data.data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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

function renderHTTPHeadersAnalysis(data) {
    let userAgentHtml = '<h3>User-Agent Analysis</h3><ul>';
    Object.keys(data.userAgentCounts).forEach(ua => {
        userAgentHtml += `<li>${ua}: ${data.userAgentCounts[ua]}</li>`;
    });
    userAgentHtml += '</ul>';

    let referrerHtml = '<h3>Authorization Analysis</h3><ul>';
    Object.keys(data.authorizationCounts).forEach(ref => {
        referrerHtml += `<li>${ref}: ${data.authorizationCounts[ref]}</li>`;
    });
    referrerHtml += '</ul>';

    $('#httpHeadersAnalysis').html(userAgentHtml + referrerHtml);
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


function updateTargetedEndpoints(limit) {
    const logs = JSON.parse(localStorage.getItem('logs'));
    if (logs) {
        const targetedEndpointsData = calculateTargetedEndpoints(logs, limit);
        renderTargetedEndpointsChart(targetedEndpointsData);
    } else {
        console.error('Nessun log trovato in localStorage.');
    }
}