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
        const targetedEndpointsData = calculateTargetedEndpoints(logs);
        const suspiciousIPs = calculateSuspiciousIPs(logs);
        const temporalPatterns = calculateTemporalPatterns(logs);
        const httpHeadersAnalysis = analyzeHTTPHeaders(logs);
        const requestParamsPayloadAnalysis = analyzeRequestParamsPayload(logs);
        const geoLocationRequests = analyzeGeoLocation(logs);
        const authPatterns = analyzeAuthPatterns(logs);
        const errorResponseAnalysis = analyzeErrorResponses(logs);
        const clientBehaviorAnalysis = analyzeClientBehavior(logs);

        renderAttackPatternsChart(attackPatterns);
        renderTargetedEndpointsChart(targetedEndpointsData);
        renderSuspiciousIPsList(suspiciousIPs);
        renderTemporalPatternsChart(temporalPatterns);
        renderHTTPHeadersAnalysis(httpHeadersAnalysis);
        renderRequestParamsPayloadAnalysis(requestParamsPayloadAnalysis);
        renderGeoLocationRequests(geoLocationRequests);
        renderAuthPatterns(authPatterns);
        renderErrorResponseAnalysis(errorResponseAnalysis);
        renderClientBehaviorAnalysis(clientBehaviorAnalysis);
    }

    // Functions for calculating data
    function calculateAttackPatterns(logs) {
        const patternCounts = {
            'SQL Injection': 0,
            'XSS': 0,
            'CSRF': 0,
            'Brute Force': 0,
            'DDoS': 0,
            'Invalid Content-Type': 0,
            'Missing Authentication': 0
        };

        logs.forEach(log => {
            const requestBody = log.requestBody || '';
            const requestURL = log.requestURL || '';
            const responseStatus = log.responseStatus || 0;
            const contentType = log.contentType || '';

            if (requestBody.includes('SELECT') || requestBody.includes('DROP')) {
                patternCounts['SQL Injection']++;
            }
            if (requestBody.includes('<script>')) {
                patternCounts['XSS']++;
            }
            if (requestBody.includes('csrf_token')) {
                patternCounts['CSRF']++;
            }
            if (requestURL.includes('/login') && responseStatus === 401) {
                patternCounts['Brute Force']++;
            }
            if (log.httpMethod === 'GET' && responseStatus === 503) {
                patternCounts['DDoS']++;
            }
            if (contentType !== 'application/json' && log.httpMethod === 'POST') {
                patternCounts['Invalid Content-Type']++;
            }
            if (responseStatus === 401 && !log.headers_authorization) {
                patternCounts['Missing Authentication']++;
            }
        });

        return {
            labels: Object.keys(patternCounts),
            data: Object.values(patternCounts)
        };
    }

    function calculateTargetedEndpoints(logs) {
        const endpointCounts = {};

        logs.forEach(log => {
            const requestURL = log.requestURL || 'Unknown';
            endpointCounts[requestURL] = (endpointCounts[requestURL] || 0) + 1;
        });

        const labels = Object.keys(endpointCounts);
        const data = Object.values(endpointCounts);

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
        const referrerCounts = {};

        logs.forEach(log => {
            const userAgent = log.headers_useragent || 'Unknown';
            const referrer = log.headers_referer || 'Unknown';
            userAgentCounts[userAgent] = (userAgentCounts[userAgent] || 0) + 1;
            referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
        });

        return {
            userAgentCounts: userAgentCounts,
            referrerCounts: referrerCounts
        };
    }

    function analyzeRequestParamsPayload(logs) {
        let injectionAttempts = 0;
        let dataFormatIssues = 0;

        logs.forEach(log => {
            const requestBody = log.requestBody || '';
            if (requestBody.includes('SELECT') || requestBody.includes('DROP')) {
                injectionAttempts++;
            }
            if (!isValidJSON(requestBody)) {
                dataFormatIssues++;
            }
        });

        return {
            injectionAttempts: injectionAttempts,
            dataFormatIssues: dataFormatIssues
        };
    }

    function isValidJSON(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
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

    function analyzeAuthPatterns(logs) {
        let tokenIssues = 0;
        let accessControlIssues = 0;

        logs.forEach(log => {
            const authHeader = log.headers_authorization || null;
            const responseStatus = log.responseStatus || 0;

            if (authHeader) {
                // Implement logic for detecting token reuse or expired tokens
            }
            if (responseStatus === 403) {
                accessControlIssues++;
            }
        });

        return {
            tokenIssues: tokenIssues,
            accessControlIssues: accessControlIssues
        };
    }

    function analyzeErrorResponses(logs) {
        const errorCounts = {};

        logs.forEach(log => {
            const responseStatus = log.responseStatus || 0;
            if (responseStatus >= 400) {
                errorCounts[responseStatus] = (errorCounts[responseStatus] || 0) + 1;
            }
        });

        return errorCounts;
    }

    function analyzeClientBehavior(logs) {
        const sessionCounts = {};

        logs.forEach(log => {
            const sessionID = log.cookies && log.cookies.match(/JSESSIONID=([^;]+)/) ? log.cookies.match(/JSESSIONID=([^;]+)/)[1] : 'No Session';
            sessionCounts[sessionID] = (sessionCounts[sessionID] || 0) + 1;
        });

        return sessionCounts;
    }

    // Functions to render charts
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
        new Chart(ctx, {
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

        let referrerHtml = '<h3>Referrer Analysis</h3><ul>';
        Object.keys(data.referrerCounts).forEach(ref => {
            referrerHtml += `<li>${ref}: ${data.referrerCounts[ref]}</li>`;
        });
        referrerHtml += '</ul>';

        $('#httpHeadersAnalysis').html(userAgentHtml + referrerHtml);
    }

    function renderRequestParamsPayloadAnalysis(data) {
        const analysisHtml = `
            <h3>Injection Attempts: ${data.injectionAttempts}</h3>
            <h3>Data Format Issues: ${data.dataFormatIssues}</h3>
        `;
        $('#requestParamsPayloadAnalysis').html(analysisHtml);
    }

    function renderGeoLocationRequests(data) {
        let geoHtml = '<ul>';
        Object.keys(data).forEach(location => {
            geoHtml += `<li>${location}: ${data[location]}</li>`;
        });
        geoHtml += '</ul>';
        $('#geoLocationRequests').html(geoHtml);
    }

    function renderAuthPatterns(data) {
        const authHtml = `
            <h3>Token Issues: ${data.tokenIssues}</h3>
            <h3>Access Control Issues: ${data.accessControlIssues}</h3>
        `;
        $('#authPatterns').html(authHtml);
    }

    function renderErrorResponseAnalysis(data) {
        let errorHtml = '<ul>';
        Object.keys(data).forEach(status => {
            errorHtml += `<li>${status}: ${data[status]}</li>`;
        });
        errorHtml += '</ul>';
        $('#errorResponseAnalysis').html(errorHtml);
    }

    function renderClientBehaviorAnalysis(data) {
        let behaviorHtml = '<ul>';
        Object.keys(data).forEach(session => {
            behaviorHtml += `<li>Session ${session}: ${data[session]}</li>`;
        });
        behaviorHtml += '</ul>';
        $('#clientBehaviorAnalysis').html(behaviorHtml);
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
