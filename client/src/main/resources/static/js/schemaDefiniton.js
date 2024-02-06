function visualProcessing(currentLabel, btn) {

    // evidenzio l'elemento selezionato
    const allLabels = document.querySelectorAll('label[class="checkboxes"]');
    allLabels.forEach(label => {
        // label.style.color = 'gray'
        if (label.id === currentLabel) {
            if (btn.innerText === 'Close') {
                label.style.backgroundColor = 'white'
            }
            else {
                label.style.backgroundColor = 'yellow'
            }
        }
        else {
            label.style.backgroundColor = 'white'
        }
    });

    const allButtons = document.querySelectorAll('button[class="checkboxes"]');
    var isClosed = btn.innerText === 'Close';
    allButtons.forEach(button => {
        button.innerText = 'Open'
    });
    if (isClosed) {
        btn.innerText = 'Open'
    }
    else {
        btn.innerText = 'Close'
    }
}

function handleLabelClick(label, btn) {

    const allLabels = document.querySelectorAll('input[type="checkbox"]');
    allLabels.forEach(l => {
        // label.style.color = 'gray'
        if (l.id === label) {
            l.disabled = false;
        }
    });

    var rightPanel = document.getElementById("rightPanel")

    if (btn.innerText === 'Close') {
        rightPanel.style.display = 'none'
    }
    else {
        rightPanel.style.display = 'block'

        // Rimuove tutto dal pannello destro
        rightPanel.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.src = `./definizionePojo?entityName=${label}`;
        iframe.style.width = '100%';
        iframe.style.height = '100vh';

        rightPanel.appendChild(iframe);
    }

    visualProcessing(label, btn);
}

function handleContinueButton() {
    var pojos = [];
    const allLabels = document.querySelectorAll('input[type="checkbox"]');
    allLabels.forEach(l => {
        if (l.checked === true) {
            pojos.push(l.id);
        }
    });

    // Creare un oggetto con i dati da inviare
    var data = {
        step: 'paths',
        pojos: pojos
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
