let currentContent = null;
function associateNewTag() {

    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'dialog';


    // itero su tutti i tag creti per renderli disponibili
    window.tagKeyDescMap.forEach((data, value) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = "newtag"
        checkbox.value = value;
        checkbox.id = value;

        if (value === window.tagOpened) {
            checkbox.disabled = true;
            checkbox.checked = true;
        }
        if (window.operKeyJSONMap.has(operationId)) {
            const valore = window.operKeyJSONMap.get(operationId)

            // Verifica se l'attributo 'tags' esiste nell'oggetto
            if (valore && valore.tags && Array.isArray(valore.tags)) {
                // Itera sui valori dell'attributo 'tags'
                valore.tags.forEach(tag => {
                    if (tag === value) {
                        checkbox.checked = true;
                    }
                });
            }
        }

        const label = document.createElement('label');
        label.htmlFor = value;
        label.appendChild(document.createTextNode(value));

        dialog.appendChild(checkbox);
        dialog.appendChild(label);
        dialog.appendChild(document.createElement('br'));
    });

    // Creazione dei pulsanti Chiudi e Salva
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Chiudi';
    closeButton.onclick = function () {
        document.body.removeChild(dialog);
    };

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Salva';
    saveButton.onclick = function () {
        const confirmSave = window.confirm('Salvare le modifiche?');
        if (confirmSave) {
            const allCheckboxes = document.querySelectorAll('input[type="checkbox"][class="newtag"]');
            allCheckboxes.forEach(c => {
                if (c.disabled === false) {
                    if (c.checked === true) {
                        window.operKeyJSONMap.get(operationId).tags.push(c.id);
                    }
                    else {
                        window.operKeyJSONMap.get(operationId).tags = window.operKeyJSONMap.get(operationId).tags.filter(str => str !== c.id);
                    }
                }
            });
            document.body.removeChild(dialog);
        }
        else {
            document.body.removeChild(dialog);
        }
    };

    dialog.appendChild(closeButton);
    dialog.appendChild(saveButton);

    // Aggiunta della dialog al corpo del documento
    document.body.appendChild(dialog);
}


// Funzione per aprire la dialog con JSON della risposta
function showResponseDialog(elementToStringify) {
    const responseDialog = document.createElement('div');
    responseDialog.className = 'response-dialog';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Chiudi';
    closeButton.onclick = function () {
        document.body.removeChild(responseDialog);
    };

    const jsonView = document.createElement('pre');
    jsonView.innerText = JSON.stringify(elementToStringify, null, 2);

    responseDialog.appendChild(jsonView);
    responseDialog.appendChild(closeButton);

    document.body.appendChild(responseDialog);
}

function buildResponses() {

    currentContent = null;
    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'dialog';


    // creazione del div per creare una nuova risposta
    const createResponseDiv = document.createElement('div');
    createResponseDiv.className = 'create-response';

    const statusCodeLabel = document.createElement('label');
    statusCodeLabel.innerText = 'Status Code:';
    const statusCodeInput = document.createElement('input');
    statusCodeInput.type = 'number';

    const descriptionLabel = document.createElement('label');
    descriptionLabel.innerText = 'Description:';
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';

    const jsonView = document.createElement('div');
    jsonView.id = 'jsonView'



    const addContentButton = document.createElement('button');
    addContentButton.id = 'addContentBtn'
    addContentButton.innerText = 'Aggiungi Content';
    addContentButton.onclick = function () {
        if (isEmptyString(statusCodeInput.value)) {
            alert("Necessario valorizzare lo status code")
        }
        else {
            showContentDialog();
        }
    };



    const saveButton = document.createElement('button');
    saveButton.innerText = 'Salva Risposta';
    saveButton.onclick = function () {
        const response = new Response();
        response.statusCode = statusCodeInput.value;
        response.description = descriptionInput.value;
        response.content = currentContent;
        window.operKeyJSONMap.get(operationId).responses.push(response);
        document.body.removeChild(dialog);
    };

    createResponseDiv.appendChild(statusCodeLabel);
    createResponseDiv.appendChild(statusCodeInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(descriptionLabel);
    createResponseDiv.appendChild(descriptionInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(addContentButton);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(jsonView);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(saveButton);
    dialog.appendChild(createResponseDiv);


    if (window.operKeyJSONMap.has(operationId) && window.operKeyJSONMap.get(operationId).responses.length > 0) {
        const title = document.createElement('h2');
        title.innerText = "Risposte create"
        dialog.appendChild(title);

        window.operKeyJSONMap.get(operationId).responses.forEach(response => {
            const responseButton = document.createElement('button');
            responseButton.innerText = `${response.statusCode}`;
            responseButton.onclick = function () {
                showResponseDialog(response);
            };

            dialog.appendChild(responseButton);
        })
    }


    // Creazione dei pulsanti Chiudi e Salva
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Chiudi';
    closeButton.onclick = function () {
        document.body.removeChild(dialog);
    };

    dialog.appendChild(closeButton);

    // Aggiunta della dialog al corpo del documento
    document.body.appendChild(dialog);
}

function buildParameters() {

    currentContent = null;
    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'dialog';


    // creazione del div per creare una nuova risposta
    const createResponseDiv = document.createElement('div');
    createResponseDiv.className = 'create-params';

    const nameLabel = document.createElement('label');
    nameLabel.innerText = 'Name:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';

    const descriptionLabel = document.createElement('label');
    descriptionLabel.innerText = 'Description:';
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';

    const intypeLabel = document.createElement('label');
    intypeLabel.innerText = 'In:';
    const intypeInput = document.createElement('input');
    intypeInput.type = 'text';

    const requiredLabel = document.createElement('label');
    requiredLabel.innerText = 'Required:';
    const requiredInput = document.createElement('input');
    requiredInput.type = 'text';

    const allowEmptyLabel = document.createElement('label');
    allowEmptyLabel.innerText = 'AllowEmpty:';
    const allowEmptyInput = document.createElement('input');
    allowEmptyInput.type = 'text';

    const jsonView = document.createElement('div');
    jsonView.id = 'jsonView'



    const addSchemaButton = document.createElement('button');
    addSchemaButton.id = 'addContentBtn'
    addSchemaButton.innerText = 'Aggiungi Schema';
    addSchemaButton.onclick = function () {
        showSchemaDialog();
    };



    const saveButton = document.createElement('button');
    saveButton.innerText = 'Salva Parametro';
    saveButton.onclick = function () {
        const par = new Parameter();
        par.description = descriptionInput.value;
        par.name = nameInput.value;
        par.required = requiredInput.value;
        par.allowEmptyValue = allowEmptyInput.value;
        par.intype = intypeInput.value;
        par.content = currentContent;
        window.operKeyJSONMap.get(operationId).parameters.push(par);
        document.body.removeChild(dialog);
    };

    createResponseDiv.appendChild(nameLabel);
    createResponseDiv.appendChild(nameInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(intypeLabel);
    createResponseDiv.appendChild(intypeInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(descriptionLabel);
    createResponseDiv.appendChild(descriptionInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(requiredLabel);
    createResponseDiv.appendChild(requiredInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(allowEmptyLabel);
    createResponseDiv.appendChild(allowEmptyInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(addSchemaButton);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(jsonView);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(saveButton);
    dialog.appendChild(createResponseDiv);


    if (window.operKeyJSONMap.has(operationId) && window.operKeyJSONMap.get(operationId).parameters.length > 0) {
        const title = document.createElement('h2');
        title.innerText = "Parametri creati"
        dialog.appendChild(title);

        window.operKeyJSONMap.get(operationId).parameters.forEach(par => {
            const responseButton = document.createElement('button');
            responseButton.innerText = `${par.name}`;
            responseButton.onclick = function () {
                showResponseDialog(par);
            };

            dialog.appendChild(responseButton);
        })
    }


    // Creazione dei pulsanti Chiudi e Salva
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Chiudi';
    closeButton.onclick = function () {
        document.body.removeChild(dialog);
    };

    dialog.appendChild(closeButton);

    // Aggiunta della dialog al corpo del documento
    document.body.appendChild(dialog);
}


function buildRequest() {

    currentContent = null;
    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'dialog';

    if (window.operKeyJSONMap.has(operationId) && window.operKeyJSONMap.get(operationId).requestBody != null && !isObjectEmpty(window.operKeyJSONMap.get(operationId).requestBody)) {
        const title = document.createElement('h2');
        title.innerText = "Request Body"
        dialog.appendChild(title);


        const jsonView = document.createElement('pre');
        jsonView.innerText = JSON.stringify(window.operKeyJSONMap.get(operationId).requestBody, null, 2);

        dialog.appendChild(jsonView);
    }
    else {
        // creazione del div per creare una nuova risposta
        const createResponseDiv = document.createElement('div');
        createResponseDiv.className = 'create-request';

        const descriptionLabel = document.createElement('label');
        descriptionLabel.innerText = 'Description:';
        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';

        const requiredLabel = document.createElement('label');
        requiredLabel.innerText = 'Required:';
        const requiredInput = document.createElement('input');
        requiredInput.type = 'text';


        const jsonView = document.createElement('div');
        jsonView.id = 'jsonView'

        const addContentButton = document.createElement('button');
        addContentButton.id = 'addContentBtn'
        addContentButton.innerText = 'Aggiungi Content';
        addContentButton.onclick = function () {
            showContentDialog();
        };



        const saveButton = document.createElement('button');
        saveButton.innerText = 'Salva Request Body';
        saveButton.onclick = function () {
            const request = new RequestBody();
            request.required = requiredLabel.value;
            request.description = descriptionInput.value;
            request.content = currentContent;
            window.operKeyJSONMap.get(operationId).requestBody = request;
            document.body.removeChild(dialog);
        };


        createResponseDiv.appendChild(descriptionLabel);
        createResponseDiv.appendChild(descriptionInput);
        createResponseDiv.appendChild(document.createElement('br'));
        createResponseDiv.appendChild(requiredLabel);
        createResponseDiv.appendChild(requiredInput);
        createResponseDiv.appendChild(document.createElement('br'));
        createResponseDiv.appendChild(addContentButton);
        createResponseDiv.appendChild(document.createElement('br'));
        createResponseDiv.appendChild(jsonView);
        createResponseDiv.appendChild(document.createElement('br'));
        createResponseDiv.appendChild(saveButton);
        dialog.appendChild(createResponseDiv);


        if (window.operKeyJSONMap.has(operationId) && window.operKeyJSONMap.get(operationId).requestBody != null && window.operKeyJSONMap.get(operationId).requestBody !== {}) {
            const title = document.createElement('h2');
            title.innerText = "Request Body"
            dialog.appendChild(title);

            showResponseDialog(window.operKeyJSONMap.get(operationId).requestBody);
        }
    }
    // Creazione dei pulsanti Chiudi e Salva
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Chiudi';
    closeButton.onclick = function () {
        document.body.removeChild(dialog);
    };

    dialog.appendChild(closeButton);
    // Aggiunta della dialog al corpo del documento
    document.body.appendChild(dialog);
}

// Funzione per aprire la dialog con JSON del content
function showContentDialog() {
    const contentDialog = document.createElement('div');
    contentDialog.className = 'content-dialog';

    const typeLabel = document.createElement('label');
    typeLabel.innerText = 'Type:';
    const typeInput = document.createElement('input');
    typeInput.type = 'text';

    const schemaReferenceLabel = document.createElement('label');
    schemaReferenceLabel.innerText = 'Schema Reference:';
    const schemaReferenceInput = document.createElement('input');
    schemaReferenceInput.type = 'text';

    const schemaTypeLabel = document.createElement('label');
    schemaTypeLabel.innerText = 'Schema Type:';
    const schemaTypeInput = document.createElement('input');
    schemaTypeInput.type = 'text';

    const schemaFormatLabel = document.createElement('label');
    schemaFormatLabel.innerText = 'Schema Format:';
    const schemaFormatInput = document.createElement('input');
    schemaFormatInput.type = 'text';

    const saveContentButton = document.createElement('button');
    saveContentButton.innerText = 'Salva Content';
    saveContentButton.onclick = function () {
        const c = new Content();
        c.type = typeInput.value;
        const s = new Schema();
        s.type = schemaTypeInput.value;
        s.format = schemaFormatInput.value;
        s.reference = schemaReferenceInput.value;
        c.schema = s;
        currentContent = c

        const jsonView = document.getElementById('jsonView');
        emptyDiv('jsonView')
        const jsonViewN = document.createElement('pre');
        jsonViewN.innerText = JSON.stringify(c, null, 2);
        jsonView.appendChild(jsonViewN);
        document.body.removeChild(contentDialog);
        hideDisplayBlockElement('addContentBtn')
    };

    contentDialog.appendChild(typeLabel);
    contentDialog.appendChild(typeInput);
    contentDialog.appendChild(document.createElement('br'));
    contentDialog.appendChild(schemaReferenceLabel);
    contentDialog.appendChild(schemaReferenceInput);
    contentDialog.appendChild(document.createElement('br'));
    contentDialog.appendChild(schemaTypeLabel);
    contentDialog.appendChild(schemaTypeInput);
    contentDialog.appendChild(document.createElement('br'));
    contentDialog.appendChild(schemaFormatLabel);
    contentDialog.appendChild(schemaFormatInput);
    contentDialog.appendChild(document.createElement('br'));
    contentDialog.appendChild(saveContentButton);

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Chiudi';
    closeButton.onclick = function () {
        document.body.removeChild(contentDialog);
    };

    contentDialog.appendChild(closeButton);

    document.body.appendChild(contentDialog);
}


function showSchemaDialog() {
    const contentDialog = document.createElement('div');
    contentDialog.className = 'content-dialog';

    const schemaReferenceLabel = document.createElement('label');
    schemaReferenceLabel.innerText = 'Schema Reference:';
    const schemaReferenceInput = document.createElement('input');
    schemaReferenceInput.type = 'text';

    const schemaTypeLabel = document.createElement('label');
    schemaTypeLabel.innerText = 'Schema Type:';
    const schemaTypeInput = document.createElement('input');
    schemaTypeInput.type = 'text';

    const schemaFormatLabel = document.createElement('label');
    schemaFormatLabel.innerText = 'Schema Format:';
    const schemaFormatInput = document.createElement('input');
    schemaFormatInput.type = 'text';

    const saveContentButton = document.createElement('button');
    saveContentButton.innerText = 'Salva Content';
    saveContentButton.onclick = function () {

        const s = new Schema();
        s.type = schemaTypeInput.value;
        s.format = schemaFormatInput.value;
        s.reference = schemaReferenceInput.value;

        currentContent = s

        const jsonView = document.getElementById('jsonView');
        emptyDiv('jsonView')
        const jsonViewN = document.createElement('pre');
        jsonViewN.innerText = JSON.stringify(s, null, 2);
        jsonView.appendChild(jsonViewN);
        document.body.removeChild(contentDialog);
        hideDisplayBlockElement('addContentBtn')
    };

    contentDialog.appendChild(schemaReferenceLabel);
    contentDialog.appendChild(schemaReferenceInput);
    contentDialog.appendChild(document.createElement('br'));
    contentDialog.appendChild(schemaTypeLabel);
    contentDialog.appendChild(schemaTypeInput);
    contentDialog.appendChild(document.createElement('br'));
    contentDialog.appendChild(schemaFormatLabel);
    contentDialog.appendChild(schemaFormatInput);
    contentDialog.appendChild(document.createElement('br'));
    contentDialog.appendChild(saveContentButton);

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Chiudi';
    closeButton.onclick = function () {
        document.body.removeChild(contentDialog);
    };

    contentDialog.appendChild(closeButton);

    document.body.appendChild(contentDialog);
}

function setOperationMethod(method) {
    window.operKeyJSONMap.get(window.operationOpened).method = method;
}

function setOperationSummary(summary) {
    window.operKeyJSONMap.get(window.operationOpened).summary = summary;
}

function setOperationDescription(descr) {
    window.operKeyJSONMap.get(window.operationOpened).description = descr;
}


function finalSave(){
    window.operKeyJSONMap.get(window.operationOpened).id = window.operationOpened;
}