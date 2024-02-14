window.tagOpened = '';
window.pathOpened = '';
window.operationOpened = '';

window.tagKeyDescMap = new Map(); // mappa con tag come chiave e descrizione tag come valore
window.pathMap = new Map(); // mappa con tag come chiave e array di path come valore
window.operationsMap = new Map(); // mappa con path come chiave e array di operazioni come valore
window.operKeyJSONMap = new Map(); // mappa con operID come chiave e oggetto OpenAPiSPecification come valore


document.addEventListener('DOMContentLoaded', function () {

    $('#continue').click(function () {
        handleContinueButton()
    });

    $('#reset').click(function () {
        window.location.reload()
    });

    window.tagKeyDescMap.clear();
    window.pathMap.clear();
    window.operationsMap.clear();
    window.operKeyJSONMap.clear();

    const confirmCRUD = window.confirm("Do you want to generate CRUD methods for each of the entities defined in the previous step?")
    if (confirmCRUD) {
        const pojos = []
        const allLabels = document.querySelectorAll('p[class="currentPojoElement"]');
        allLabels.forEach(p => {
            pojos.push(p.innerText)
        });
        initializeCRUD(pojos)
    }

    let confirmSpecificMethod = false;
    let atLeastOneSpecific = false;
    const allLabels = document.querySelectorAll('p[class="currentPojoElement"]');
    allLabels.forEach(p => {
        if (p.innerText === "User") {
            confirmSpecificMethod = window.confirm("It's the User entity present, do you want to create the \"login\", \"logout\" and \"admin\" endpoints?")
            if (confirmSpecificMethod) {
                atLeastOneSpecific = true;
                initializeLoginOut()
            }
        }
        if (p.innerText === "Workstation") {
            confirmSpecificMethod = window.confirm("It's the Workstation entity present, do you want to create the \"accessWorkstation\" endpoint?")
            if (confirmSpecificMethod) {
                atLeastOneSpecific = true;
                initializeWorkstation()
            }
        }
        if (p.innerText === "Transaction") {
            confirmSpecificMethod = window.confirm("It's the Transaction entity present, do you want to create the \"sendMoney\" and \"receiveMoney\" endpoints?")
            if (confirmSpecificMethod) {
                atLeastOneSpecific = true;
                initializeTransaction()
            }
        }
        if (p.innerText === "Crypto") {
            confirmSpecificMethod = window.confirm("It's the Crypto entity present, do you want to create the \"transfer\" endpoint?")
            if (confirmSpecificMethod) {
                atLeastOneSpecific = true;
                initializeCrypto()
            }
        }
    });

    if (confirmCRUD || confirmSpecificMethod) {
        initializeTagList();
    }
});

function initializeTagList() {
    window.tagKeyDescMap.forEach((data, value) => {
        addTagButton(value);
    });
}

// LOGICHE PER LA VISUALIZZAZIONE DELLE VARIE SEZIONI

// Funzione scatenata al click su un tag
function openTagSection(tagValue) {
    showHiddenElement("tagSection");
    hideShownElement("pathSection");
    hideShownElement("operationSection");
    document.getElementById('tagSelected').innerText = tagValue
    window.tagOpened = tagValue;

    // resetto il valore dei campi
    document.getElementById('newPath').value = ''

    // Devo azzerare e ricreare la lista di path in base al tag
    emptyDiv('pathValues')
    if (pathMap != null && pathMap.get(tagValue) != null){
        const pathsToBeAdded = pathMap.get(tagValue);
        pathsToBeAdded.forEach(function(pathValue) {
            addPathButton(pathValue);
        });
    }
}

// Funzione scatenata al click su un path
function openPathSection(pathValue) {
    showHiddenElement('pathSection')
    hideShownElement("operationSection");
    document.getElementById('pathSelected').innerText = pathValue
    window.pathOpened = pathValue;

    // resetto il valore dei campi
    document.getElementById('newOperation').value = ''

    // Devo azzerare e ricreare la lista di operazioni in base al path
    emptyDiv('operationsValues')

    if (operationsMap != null && operationsMap.get(pathValue) != null) {
        const pathsToBeAdded = operationsMap.get(pathValue);
        pathsToBeAdded.forEach(function(operValue) {
            addOperationButton(operValue);
        });
    }
}

function openOperationSection(operationValue) {
    showHiddenElement('operationSection')
    document.getElementById('operationSelected').innerText = operationValue
    window.operationOpened = operationValue;

    // resetto il valore dei campi
    document.getElementById('method').value = 'GET'
    document.getElementById('operationSummary').value = ''
    document.getElementById('operationDescription').value = ''

    // se l'operazione è nuova o non è stata salvata in precedenza (id === '') allora si resetta il valore
    if (window.operKeyJSONMap.get(operationValue) == null || window.operKeyJSONMap.get(operationValue).id === '') {
        const oap = new OpenApiOperation();
        oap.tags.push(window.tagOpened)
        window.operKeyJSONMap.set(operationValue, oap);
    }
    else {
        const oap = window.operKeyJSONMap.get(operationValue)
        // valorizzazione dei campi
        document.getElementById('method').value = oap.method.toUpperCase();
        document.getElementById('operationSummary').value = oap.summary
        document.getElementById('operationDescription').value = oap.description
    }
    // in ogni caso, si entra nella sezione di definizione dell'operazione con l'istanza presente nella mappa
}


// AGGIUNTA DI NUOVI ELEMENTI

function addTag() {

    // Validazione del campo "name"
    const tagNameInput = document.getElementById('name');
    const tagNameValue = tagNameInput.value.trim();
    if (isEmptyString(tagNameValue)) {
        alert('The "name" field cannot be empty.');
        return;
    }
    // Recupero del campo "description"
    const tagDescInput = document.getElementById('description');
    const tagDescValue = tagDescInput.value.trim();
    // Aggiungo il nuovo tag alla mappa
    tagKeyDescMap.set(tagNameValue, tagDescValue);

    addTagButton(tagNameValue);

    // Pulizia dei campi di input
    tagNameInput.value = '';
    tagDescInput.value = '';
}

function addPath() {
    const newPathInput = document.getElementById('newPath');
    const newPathValue = newPathInput.value.trim();
    if (newPathValue === '') {
        alert('The "path" field cannot be empty.');
        return;
    }

    if (pathMap == null) {
        window.pathMap = new Map();
    }
    if (!pathMap.has(tagOpened)) {
        pathMap.set(tagOpened, []);
    }
    pathMap.get(tagOpened).push(newPathValue);

    addPathButton(newPathValue)

    // Pulizia del campo di input
    newPathInput.value = '';
}

function addOperation() {
    const newOperationInput = document.getElementById('newOperation');
    const newOperationValue = newOperationInput.value.trim();
    if (newOperationValue === '') {
        alert('The "operationId" field cannot be empty.');
        return;
    }

    if (operationsMap == null) {
        window.operationsMap = new Map();
    }
    if (!operationsMap.has(pathOpened)) {
        operationsMap.set(pathOpened, [])
    }
    operationsMap.get(pathOpened).push(newOperationValue)

    addOperationButton(newOperationValue)

    // Pulizia del campo di input
    newOperationInput.value = '';
}


// AGGIUNTA DI BOTTONI

function addPathButton(pathValue){
    addButton(pathValue, 'pathValues', openPathSection)
}

function addOperationButton(operationValue){
    addButton(operationValue, 'operationsValues', openOperationSection)
}

function addTagButton(tagValue) {
    addButton(tagValue, 'tagValues', openTagSection)
}

function handleContinueButton(){

    const tags = []
    window.tagKeyDescMap.forEach((data, value) => {
        const t = new Tag()
        t.name = value;
        t.description = data;

        const listPathName = pathMap.get(value)
        for (const pathName of listPathName) {
            // trovo i singoli path del tag "value"
            const path = new Path()
            path.path = pathName

            const listOperationId = operationsMap.get(pathName)
            for (const operationId of listOperationId) {
                // trovo le singole operazioni del path "pathName"
                path.operations.push(operKeyJSONMap.get(operationId))
            }
            t.paths.push(path)
        }
        tags.push(t);
    });

    $.ajax({
        type: 'POST',
        url: '/setTags',
        contentType: 'application/json',
        data: JSON.stringify(tags),
        success: function(response) {
            window.location.href = response
        },
        error: function(error) {
            console.error('Error: ', error);
            alert("Error while proceeding to the next step")
        }
    });

}