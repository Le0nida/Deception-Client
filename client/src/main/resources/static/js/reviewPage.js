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
            url: 'validateYaml',
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

    function saveYamlFile() {

        var userInput = prompt("Inserisci il nome con cui salvare il file .yaml");

        // Controlla se l'utente ha inserito un valore
        if (userInput !== null) {
            // Creare un oggetto con i dati da inviare
            var data = {
                filename: userInput,
                yaml: document.getElementById("yamlContent").textContent
        };

            // Eseguire la richiesta POST con Ajax
            $.ajax({
                type: 'POST',
                url: 'setSpecification',
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

    // Aggiungi gli eventi ai pulsanti
    document.getElementById("downloadButton").addEventListener("click", downloadYAML);
    document.getElementById("validationButton").addEventListener("click", validate);
    document.getElementById("saveButton").addEventListener("click", saveYamlFile);
});