document.addEventListener("DOMContentLoaded", function() {
    // Funzione per formattare il testo YAML

    // Funzione per generare e scaricare il file YAML
    function downloadYAML() {
        const yamlContent = document.getElementById("yamlContent").textContent;
        const blob = new Blob([yamlContent], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);

        const downloadButton = document.getElementById("downloadButton");
        downloadButton.href = url;
    }

    // Funzione per la validazione
    function validate() {
        // Sostituisci con l'URL del server di validazione
        const validationUrl = "https://example.com/validate";

        // Creare un oggetto con i dati da inviare
        var data = {
            yaml: document.getElementById("yamlContent").textContent
        };

        // Eseguire la richiesta POST con Ajax
        $.ajax({
            type: 'POST',
            url: 'validazioneYaml',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                console.log(response)
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    }

    // Aggiungi gli eventi ai pulsanti
    document.getElementById("downloadButton").addEventListener("click", downloadYAML);
    document.getElementById("validationButton").addEventListener("click", validate);
});