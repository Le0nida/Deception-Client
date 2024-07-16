document.addEventListener("DOMContentLoaded", function() {
    $('#continue').click(function () {
        handleContinueButton()
    });

    $('#reset').click(function () {
        $.ajax({
            type: 'POST',
            url: 'resetPojos',
            success: function (response) {
                window.location.reload()
            },
            error: function (error) {
                console.error('Error:', error);
                alert("Error while restoring the page")
            }
        });
    });
    const userButton = $('#User');
    handleLabelClick('User', userButton, true)
});

function visualProcessing(currentLabel, btn, first) {

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
    const isClosed = btn.innerText === 'Close';
    allButtons.forEach(button => {
        button.innerText = 'Open'
    });
    if (isClosed) {
        btn.innerText = 'Open'
    }
    else {
        btn.innerText = 'Close'
    }
    if (first) {
        btn.get(0).innerText = 'Close'
        btn.get(0).innerHTML = 'Close'
    }
}

function handleLabelClick(label, btn, first = false) {

    const allLabels = document.querySelectorAll('input[type="checkbox"]');
    allLabels.forEach(l => {
        if (l.id === label && label !== "User") {
            l.disabled = false;
        }
    });

    const rightPanel = document.getElementById("rightPanel");

    if (btn.innerText === 'Close') {
        rightPanel.style.display = 'none'
    }
    else {
        rightPanel.style.display = 'block'

        // Rimuove tutto dal pannello destro
        rightPanel.innerHTML = '';

        const h3 = document.createElement('h3');
        h3.innerText = label
        rightPanel.appendChild(h3);

        const iframe = document.createElement('iframe');
        iframe.src = `./pojoDefinition?entityName=${label}`;
        iframe.style.width = '100%';

        rightPanel.appendChild(iframe);
    }

    visualProcessing(label, btn, first);
}

function handleContinueButton() {
    const pojos = [];
    const allLabels = document.querySelectorAll('input[type="checkbox"]');
    allLabels.forEach(l => {
        if (l.checked === true) {
            pojos.push(l.id);
        }
    });

    if (pojos.length === 0) {
        alert("At least one entity must be selected");
        return;
    }

    // Creare un oggetto con i dati da inviare
    const data = {
        step: 'personalizedEntities',
        pojos: pojos
    };

    $.ajax({
        type: 'POST',
        url: 'creazioneSpecifica',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            window.location.href = 'personalizedEntities'
        },
        error: function (error) {
            console.error('Error:', error);
            alert("Error while proceeding to the next step")
        }
    });
}
