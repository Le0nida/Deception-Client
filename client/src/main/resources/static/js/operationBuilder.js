let currentContent = null;

document.addEventListener("DOMContentLoaded", function() {

    // Chiudi la dialog se si clicca al di fuori di essa
    $(document).mouseup(function(e) {
        var dialog = $('#operation-dialog-container');
        // Se il click non è all'interno della dialog o del pulsante "Import", chiudi la dialog
        if (!dialog.is(e.target) && dialog.has(e.target).length === 0 && !$('#import').is(e.target)) {
            dialog.hide();
            $('body').removeClass('dialog-open');
        }
    });
});

// FUNZIONI DI UTILITA' ------------------------------------------------------------------------------------------------

function removeElementsByClass(className, parentDivId) {
    var parentDiv = document.getElementById(parentDivId);
    if (parentDiv) {
        var elements = parentDiv.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    } else {
        console.error("Parent div with id " + parentDivId + " not found.");
    }
}

// Funzione per aprire la dialog con JSON della risposta
function showCreatedJsonDialog(elementToStringify) {

    removeElementsByClass("created-json-dialog", "json-view");

    const responseDialog = document.createElement('div');
    responseDialog.className = 'created-json-dialog';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Chiudi';
    closeButton.onclick = function () {
        document.getElementById('json-view').removeChild(responseDialog);
    };

    const jsonView = document.createElement('pre');
    jsonView.innerText = JSON.stringify(elementToStringify, null, 2);

    responseDialog.appendChild(jsonView);
    responseDialog.appendChild(closeButton);

    document.getElementById('json-view').appendChild(responseDialog);
}

function showMainDialog() {
    $('#operation-dialog-container').show();
    $('body').addClass('dialog-open');
}

function hideMainDialog() {
    $('#operation-dialog-container').hide();
    $('body').removeClass('dialog-open');
}

function createSchemaSection() {
    const createSchemaDiv = document.createElement('div');
    createSchemaDiv.className = 'form-section';

    const schemaReferenceLabel = document.createElement('label');
    schemaReferenceLabel.innerText = 'Reference:';
    const schemaReferenceInput = document.createElement('input');
    schemaReferenceInput.type = 'text';
    schemaReferenceInput.id = 'schemaReferenceInput';

    const schemaTypeLabel = document.createElement('label');
    schemaTypeLabel.innerText = 'Type:';
    const schemaTypeInput = document.createElement('input');
    schemaTypeInput.type = 'text';
    schemaTypeInput.id = 'schemaTypeInput';

    const schemaFormatLabel = document.createElement('label');
    schemaFormatLabel.innerText = 'Format:';
    const schemaFormatInput = document.createElement('input');
    schemaFormatInput.type = 'text';
    schemaFormatInput.id = 'schemaFormatInput';

    const schemaTitle = document.createElement('h3');
    schemaTitle.innerText = "Schema"

    createSchemaDiv.appendChild(schemaTitle);
    createSchemaDiv.appendChild(schemaReferenceLabel);
    createSchemaDiv.appendChild(schemaReferenceInput);
    createSchemaDiv.appendChild(document.createElement('br'));
    createSchemaDiv.appendChild(schemaTypeLabel);
    createSchemaDiv.appendChild(schemaTypeInput);
    createSchemaDiv.appendChild(document.createElement('br'));
    createSchemaDiv.appendChild(schemaFormatLabel);
    createSchemaDiv.appendChild(schemaFormatInput);

    return createSchemaDiv;
}

function createContentSection() {

    const createContentDiv = document.createElement('div');
    createContentDiv.className = 'form-section';

    const contentTypeLabel = document.createElement('label');
    contentTypeLabel.innerText = 'Type:';
    const contentTypeInput = document.createElement('input');
    contentTypeInput.type = 'text';
    contentTypeInput.id = 'contentTypeInput';

    // Schema section -------------
    const createSchemaDiv = createSchemaSection();

    const contentTitle = document.createElement('h3');
    contentTitle.innerText = "Content"

    createContentDiv.appendChild(contentTitle);
    createContentDiv.appendChild(contentTypeLabel);
    createContentDiv.appendChild(contentTypeInput);
    createContentDiv.appendChild(createSchemaDiv);

    return createContentDiv
}

function buildFormSectionDiv(){
    const div = document.createElement('div');
    div.className = 'form-section';
    div.id = 'build-info-dialog';
    return div
}


// FUNZIONI DI GESTIONE ------------------------------------------------------------------------------------------------

function buildParameters() {
    // Svuoto il div contenitore
    $('#operation-dialog-container').empty();
    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'operation-dialog';

    // creazione del div per contenere il form di creazione
    const createResponseDiv = buildFormSectionDiv()

    // creazione di tutti i campi del form
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

    // Schema section
    const createSchemaDiv = createSchemaSection();

    // Bottone di salvataggio
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save parameter';
    saveButton.onclick = function () {
        const par = new Parameter();
        par.description = descriptionInput.value;
        par.name = nameInput.value;
        par.required = requiredInput.value;
        par.allowEmptyValue = allowEmptyInput.value;
        par.intype = intypeInput.value;
        par.schema.type = document.getElementById('schemaTypeInput').value;
        par.schema.reference = document.getElementById('schemaReferenceInput').value;
        par.schema.format = document.getElementById('schemaFormatInput').value;
        window.operKeyJSONMap.get(operationId).parameters.push(par);
        document.getElementById('operation-dialog-container').removeChild(dialog);
        hideMainDialog()
    };

    // Creazione del titolo della form
    const title = document.createElement('h2');
    title.innerText = "New parameter"
    createResponseDiv.appendChild(title);

    // Aggiunta di tutti gli elementi al form
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
    createResponseDiv.appendChild(jsonView);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(createSchemaDiv);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(saveButton);
    dialog.appendChild(createResponseDiv);

    // se l'operazione ha già dei parametri li mostro
    if (window.operKeyJSONMap.has(operationId) && window.operKeyJSONMap.get(operationId).parameters.length > 0) {
        const paramsCreated = document.createElement('div');
        paramsCreated.className = 'form-section';
        paramsCreated.id = 'json-view';
        const title = document.createElement('h2');
        title.innerText = "Current parameters"
        paramsCreated.appendChild(title);

        window.operKeyJSONMap.get(operationId).parameters.forEach(par => {
            const responseButton = document.createElement('button');
            responseButton.innerText = `${par.name}`;
            responseButton.onclick = function () {
                showCreatedJsonDialog(par);
            };
            paramsCreated.appendChild(responseButton);
        })
        dialog.appendChild(paramsCreated)
    }

    // Aggiunta della dialog
    document.getElementById('operation-dialog-container').appendChild(dialog);
    showMainDialog()
}

function buildRequest() {
    // Svuoto il div contenitore
    $('#operation-dialog-container').empty();
    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'operation-dialog';

    // creazione del div per creare una nuova richiesta o mostrare il json
    const createResponseDiv = buildFormSectionDiv()

    // se c'è già una request body la mostro
    if (window.operKeyJSONMap.has(operationId) && window.operKeyJSONMap.get(operationId).requestBody != null && !isObjectEmpty(window.operKeyJSONMap.get(operationId).requestBody)) {
        const title = document.createElement('h2');
        title.innerText = "Request Body"
        createResponseDiv.appendChild(title)

        const jsonView = document.createElement('pre');
        jsonView.innerText = JSON.stringify(window.operKeyJSONMap.get(operationId).requestBody, null, 2);
        createResponseDiv.appendChild(jsonView);

        dialog.appendChild(createResponseDiv);
    }
    // altrimenti genero il form di creazione
    else {

        // crazione di tutti i campi del form
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

        // Content section
        const createContentDiv = createContentSection();

        // Bottone di salvataggio
        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save RequestBody';
        saveButton.onclick = function () {
            const request = new RequestBody();
            request.required = requiredInput.value;
            request.description = descriptionInput.value;
            request.content.type = document.getElementById('contentTypeInput').value;
            const schema = new Schema()
            schema.type = document.getElementById('schemaTypeInput').value;
            schema.reference = document.getElementById('schemaReferenceInput').value;
            schema.format = document.getElementById('schemaFormatInput').value;
            request.content.schema = schema
            window.operKeyJSONMap.get(operationId).requestBody = request;
            document.getElementById('operation-dialog-container').removeChild(dialog);
            hideMainDialog()
        };

        // Creazione del titolo della form
        const title = document.createElement('h2');
        title.innerText = "New RequestBody"
        createResponseDiv.appendChild(title);

        // Aggiunta di tutti gli elementi al form
        createResponseDiv.appendChild(descriptionLabel);
        createResponseDiv.appendChild(descriptionInput);
        createResponseDiv.appendChild(document.createElement('br'));
        createResponseDiv.appendChild(requiredLabel);
        createResponseDiv.appendChild(requiredInput);
        createResponseDiv.appendChild(document.createElement('br'));
        createResponseDiv.appendChild(jsonView);
        createResponseDiv.appendChild(document.createElement('br'));
        createResponseDiv.appendChild(createContentDiv);
        createResponseDiv.appendChild(document.createElement('br'));
        createResponseDiv.appendChild(saveButton);
        dialog.appendChild(createResponseDiv);
    }

    // Aggiunta della dialog
    document.getElementById('operation-dialog-container').appendChild(dialog);
    showMainDialog()
}

function buildResponses() {
    // Svuoto il div contenitore
    $('#operation-dialog-container').empty();
    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'operation-dialog';

    // creazione del div per contenere il form di creazione
    const createResponseDiv = buildFormSectionDiv()

    // creazione di tutti i campi del form
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

    // Content section
    const createContentDiv = createContentSection();

    // Bottone di salvataggio
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save Response';
    saveButton.onclick = function () {
        const response = new Response();
        response.statusCode = statusCodeInput.value;
        response.description = descriptionInput.value;
        const schema = new Schema()
        schema.type = document.getElementById('schemaTypeInput').value;
        schema.reference = document.getElementById('schemaReferenceInput').value;
        schema.format = document.getElementById('schemaFormatInput').value;
        response.content.type = document.getElementById('contentTypeInput').value;
        response.content.schema = schema;
        window.operKeyJSONMap.get(operationId).responses.push(response);
        document.getElementById('operation-dialog-container').removeChild(dialog);
        hideMainDialog()
    };

    // Creazione del titolo della form
    const title = document.createElement('h2');
    title.innerText = "New response"
    createResponseDiv.appendChild(title);

    // Aggiunta di tutti gli elementi al form
    createResponseDiv.appendChild(statusCodeLabel);
    createResponseDiv.appendChild(statusCodeInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(descriptionLabel);
    createResponseDiv.appendChild(descriptionInput);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(jsonView);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(createContentDiv);
    createResponseDiv.appendChild(document.createElement('br'));
    createResponseDiv.appendChild(saveButton);
    dialog.appendChild(createResponseDiv);

    // se l'operazione ha già delle risposte le mostro
    if (window.operKeyJSONMap.has(operationId) && window.operKeyJSONMap.get(operationId).responses.length > 0) {
        const paramsCreated = document.createElement('div');
        paramsCreated.className = 'form-section';
        paramsCreated.id = 'json-view';
        const title = document.createElement('h2');
        title.innerText = "Current responses"
        paramsCreated.appendChild(title);

        window.operKeyJSONMap.get(operationId).responses.forEach(response => {
            const responseButton = document.createElement('button');
            responseButton.innerText = `${response.statusCode}`;
            responseButton.onclick = function () {
                showCreatedJsonDialog(response);
            };

            paramsCreated.appendChild(responseButton);
        })
        dialog.appendChild(paramsCreated)
    }

    // Aggiunta della dialog
    document.getElementById('operation-dialog-container').appendChild(dialog);
    showMainDialog()
}

function associateNewTag() {
    // Svuoto il div contenitore
    $('#operation-dialog-container').empty();
    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'operation-dialog';

    // creazione del div per inserire la select
    const createResponseDiv = buildFormSectionDiv()

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
        label.className = 'checkbox-label'
        label.appendChild(document.createTextNode(value));

        createResponseDiv.appendChild(label);
        createResponseDiv.appendChild(checkbox);
        createResponseDiv.appendChild(document.createElement('br'));
    });


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
        }
        document.getElementById('operation-dialog-container').removeChild(dialog);
        hideMainDialog()
    };

    createResponseDiv.appendChild(saveButton)
    dialog.appendChild(createResponseDiv);

    // Aggiunta della dialog
    document.getElementById('operation-dialog-container').appendChild(dialog);
    showMainDialog()
}

function buildSecurity() {
    // Svuoto il div contenitore
    $('#operation-dialog-container').empty();
    const operationId = window.operationOpened;

    // Creazione della dialog
    const dialog = document.createElement('div');
    dialog.className = 'operation-dialog';

    // creazione del div per contenere il form di creazione
    const createResponseDiv = buildFormSectionDiv()

    const title = document.createElement('h2');
    title.innerText = "Select security scopes"
    createResponseDiv.appendChild(title);

    const par = document.createElement('p');
    par.innerText = "Se non verrà selezionato alcuno scope, lo schema di sicurezza non sarà considerato"
    createResponseDiv.appendChild(par);

    const subtitle = document.createElement('h4');
    subtitle.innerText = document.getElementById('securitySchemeName').innerText
    createResponseDiv.appendChild(subtitle);

    const securitySchemeScopes = document.querySelectorAll('p[class="securitySchemeScope"]');
    securitySchemeScopes.forEach(scope => {
        const value = scope.innerText;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = "secscope"
        checkbox.value = value;
        checkbox.id = value;

        if (window.operKeyJSONMap.get(operationId).security !== null && window.operKeyJSONMap.get(operationId).security.length > 0){
            for (const security of window.operKeyJSONMap.get(operationId).security) {
                if (security.securitySchemaName === document.getElementById('securitySchemeName').innerText) {
                    if (security.scopes !== null && security.scopes.length > 0){
                        for (const scope of security.scopes) {
                            if (scope === value) {
                                checkbox.checked = true;
                            }
                        }
                    }
                }
            }
        }

        const label = document.createElement('label');
        label.htmlFor = value;
        label.className = 'checkbox-label'
        label.appendChild(document.createTextNode(value));

        createResponseDiv.appendChild(label);
        createResponseDiv.appendChild(checkbox);
        createResponseDiv.appendChild(document.createElement('br'));
    });

    const button = document.createElement('button');
    button.innerText = "Add Optional Security"
    if (window.operKeyJSONMap.get(operationId).security !== null && window.operKeyJSONMap.get(operationId).security.length > 0){
        for (const security of window.operKeyJSONMap.get(operationId).security) {
            if (security.securitySchemaName === 'optional') {
                button.innerText = "Remove Optional Security"
                break
            }
        }
    }
    button.onclick = function () {
        if (button.innerText === "Add Optional Security") {
            const confirmSave = window.confirm('Aggiungere la sicurezza opzionale a questa operazione?');
            if (confirmSave) {
                button.innerText = "Remove Optional Security";
            }
        }
        else {
            const confirmSave = window.confirm('Rimuovere la sicurezza opzionale a questa operazione?');
            if (confirmSave) {
                button.innerText = "Add Optional Security";
            }
        }
    }
    createResponseDiv.appendChild(button);
    createResponseDiv.appendChild(document.createElement('br'));

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.onclick = function () {
        const confirmSave = window.confirm('Salvare le modifiche?');
        if (confirmSave) {
            window.operKeyJSONMap.get(operationId).security = []

            if (button.innerText === "Remove Optional Security") {
                const optsecurity = new Security();
                optsecurity.securitySchemaName = 'optional'
                window.operKeyJSONMap.get(operationId).security.push(optsecurity)
            }

            const security = new Security();
            security.securitySchemaName = document.getElementById('securitySchemeName').innerText;
            const allCheckboxes = document.querySelectorAll('input[type="checkbox"][class="secscope"]');
            allCheckboxes.forEach(c => {
                if (c.checked === true) {
                    security.scopes.push(c.id)
                }
            });
            window.operKeyJSONMap.get(operationId).security.push(security)
        }
        document.getElementById('operation-dialog-container').removeChild(dialog);
        hideMainDialog()
    };

    createResponseDiv.appendChild(saveButton)
    dialog.appendChild(createResponseDiv);

    // Aggiunta della dialog
    document.getElementById('operation-dialog-container').appendChild(dialog);
    showMainDialog()
}

// FUNZIONI PER SETTARE I CAMPI TESTUALI E LA SELECT

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