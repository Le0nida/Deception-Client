const tab_space = '&nbsp;&nbsp;&nbsp;&nbsp;'

function handleCheckboxChange(checkboxSelected, key) {
    let classNames = `${key}`.split('_')
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        if (classNames.some(element => checkbox.className.includes(element))) {
            checkbox.disabled = checkboxSelected.checked !== true;
        }
    });
}

function disableAllCheckbox() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.disabled = true
    });
}

function fetchJSONData(callback) {
    const jsonString = document.getElementById("currentPojo").innerText
    const jsonObject = JSON.parse(jsonString);
    callback(jsonObject)
}

document.addEventListener('DOMContentLoaded', function () {

    var alreadySaved = false;
    if (document.getElementById("pojoEdited").innerText === "true") {
        var saveBtn = document.getElementById('saveBtn');
        saveBtn.innerText = 'Schema salvato'
        saveBtn.style.backgroundColor = '#919191FF'
        saveBtn.disabled = true;
        alreadySaved = true;
    }

    // Function to create checkboxes for each key-value pair, including nested objects
    function createCheckboxes(jsonData, parentKey = '', indentionLevel = 0) {
        const container = document.getElementById('jsonContainer');

        for (const key in jsonData) {
            const checkboxDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            const label = document.createElement('label');

            checkbox.type = 'checkbox';
            checkbox.id = `${parentKey}${key}`;
            checkbox.className = `${parentKey}`;
            checkbox.checked = true;
            checkbox.addEventListener('change', function () {
                handleCheckboxChange(checkbox, key);
            });

            if (alreadySaved){
                checkbox.style.display = 'none'
            }

            let indent = '';
            for(let i = 0; i < indentionLevel; i++){
                indent += tab_space
            }
            if (typeof jsonData[key] === 'object' && jsonData[key] !== null) {
                label.innerHTML = `${indent}${key}:`;
            }
            else {
                label.innerHTML = `${indent}${key}: ${JSON.stringify(jsonData[key])}`;
            }
            label.setAttribute('for', `${parentKey}${key}`);

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);

            container.appendChild(checkboxDiv);

            // Recursively process nested objects
            if (typeof jsonData[key] === 'object' && jsonData[key] !== null) {
                createCheckboxes(jsonData[key], `${parentKey}${key}_`, indentionLevel+1);
            }
        }
    }

    // Fetch JSON data and create checkboxes on page load
    fetchJSONData(createCheckboxes);
});

function generateJsonFromCheckboxes(jsonData, parentKey = '', indentionLevel = 0) {
    const resultObject = {};

    for (const key in jsonData) {
        const checkbox = document.getElementById(`${parentKey}${key}`);

        // Se la checkbox è selezionata, aggiungi il valore all'oggetto risultato
        if (checkbox && checkbox.checked && !checkbox.disabled) {
            if (typeof jsonData[key] === 'object' && jsonData[key] !== null) {
                // Se l'elemento è un oggetto, chiamata ricorsiva
                resultObject[key] = generateJsonFromCheckboxes(jsonData[key], `${parentKey}${key}_`, indentionLevel + 1);
            } else {
                // Altrimenti, aggiungi il valore all'oggetto risultato
                resultObject[key] = jsonData[key];
            }
        }
    }

    return resultObject;
}


function handleSaveButtonClick(){
    const jsonString = document.getElementById("currentPojo").innerText
    const jsonObject = JSON.parse(jsonString);
    var selectedJsonData = generateJsonFromCheckboxes(jsonObject)

    const datiDaInviare = {
        attributoDaAggiornare: document.getElementById("currentPojo").className,
        valoreDaAggiornare: JSON.stringify(selectedJsonData)
    };

    // Invia una richiesta AJAX al server per aggiornare il modello
    $.ajax({
        type: 'POST',  // Puoi utilizzare 'GET' se è più appropriato
        url: '/aggiornaModello',  // Specifica l'URL del tuo endpoint Spring
        contentType: 'application/json',
        data: JSON.stringify(datiDaInviare),
        success: function(response) {
            // Gestisci la risposta dal server (se necessario)
            console.log('Modello aggiornato con successo:', response);

            var saveBtn = document.getElementById('saveBtn');
            saveBtn.innerText = 'Schema salvato'
            saveBtn.style.backgroundColor = '#919191FF'
            saveBtn.disabled = true;

            disableAllCheckbox();
        },
        error: function(error) {
            console.error('Errore durante l\'aggiornamento del modello:', error);
        }
    });



}

