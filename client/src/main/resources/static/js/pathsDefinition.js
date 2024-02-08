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

    let confirmLogin = false;
    const allLabels = document.querySelectorAll('p[class="currentPojoElement"]');
    allLabels.forEach(p => {
        if (p.innerText === "User") {
            confirmLogin = window.confirm("It's the user entity present, do you want to create the login and logout methods?")
            initializeLoginOut()
        }
    });

    if (confirmCRUD || confirmLogin) {
        initializeTagList();
    }
});

function initializeTagList() {
    window.tagKeyDescMap.forEach((data, value) => {
        addTagButton(value);
    });
}

function initializeLoginOut() {
    const tagName = "User";
    const tagNameLC = tagName.toLowerCase()

    if (!isValueInMapKeys(tagKeyDescMap, tagNameLC)) {
        // Significa che NON è gia settato il tag User
        // aggiungo il tag
        window.tagKeyDescMap.set(tagNameLC, tagName + " management")
        // aggiungo i paths
        window.pathMap.set(tagNameLC, [`/${tagNameLC}/login`, `/${tagNameLC}/logout`] )
    }

    // aggiungo i paths (a quelli già presenti)
    let userPaths = window.pathMap.get(tagNameLC);
    userPaths.push(`/${tagNameLC}/login`)
    userPaths.push(`/${tagNameLC}/logout`)

    // aggiungo le operazioni
    window.operationsMap.set(`/${tagNameLC}/login`, [`login${tagName}`])
    window.operationsMap.set(`/${tagNameLC}/logout`, [`logout${tagName}`])

    // LOGIN -----------------
    const opC = new OpenApiOperation();
    opC.id = `login${tagName}`
    opC.description = `Logs the ${tagName} into the system`
    opC.tags = [ tagNameLC ]
    opC.method = 'get'
    opC.summary = `Login for ${tagName}`

    const schema = new Schema();
    schema.type = "string"
    const content = new Content();
    content.type = 'application/json'
    content.schema = schema;

    // costruzione parametri
    const param1 = new Parameter();
    param1.name = 'username'
    param1.intype = 'query'
    param1.description = 'The username for login'
    param1.required = true
    param1.schema = schema
    opC.parameters.push(param1)

    const param2 = new Parameter();
    param2.name = 'password'
    param2.intype = 'query'
    param2.description = 'The password for login in clear text'
    param2.required = true
    param2.schema = schema
    opC.parameters.push(param2)

    // costruzione Response
    const respSuc = new Response();
    respSuc.statusCode = '200'
    respSuc.description = 'Successful operation'
    respSuc.content = content;
    opC.responses.push(respSuc)
    const respFail = new Response();
    respFail.statusCode = '400'
    respFail.description = 'Invalid username/password supplied'
    opC.responses.push(respFail)

    window.operKeyJSONMap.set(`login${tagName}`, opC)


    // LOGIN -----------------
    const opR = new OpenApiOperation();
    opR.id = `logout${tagName}`
    opR.description = `Logs out current logged in ${tagName} session`
    opR.tags = [ tagNameLC ]
    opR.method = 'get'
    opR.summary = `Logout for ${tagName}`

    // costruzione Response
    const respDef = new Response();
    respDef.statusCode = '200'
    respDef.description = 'Successful operation'
    opR.responses.push(respDef)

    window.operKeyJSONMap.set(`logout${tagName}`, opR)
}

function initializeCRUD(entities) {

    entities.forEach(ent => {
        const entLC = ent.toLowerCase();
        window.tagKeyDescMap.set(entLC, ent + " management")
        window.pathMap.set(entLC, [`/${entLC}`, `/${entLC}/{${entLC}Id}`] )
        window.operationsMap.set(`/${entLC}`, [`create${ent}`, `update${ent}`])
        window.operationsMap.set(`/${entLC}/{${entLC}Id}`, [`retrieve${ent}`, `delete${ent}`])


        // CREATE -----------------
        const opC = new OpenApiOperation();
        opC.id = `create${ent}`
        opC.description = `Create a new ${ent}`
        opC.tags = [ entLC ]
        opC.method = 'post'
        opC.summary = `Create a new ${ent}`

        // costruzione RequestBody
        const schema = new Schema();
        schema.reference = `#/components/schemas/${ent}`
        const content = new Content();
        content.type = 'application/json'
        content.schema = schema;
        const req = new RequestBody();
        req.required = true;
        req.description = `Create a new ${ent}`
        req.content = content
        opC.requestBody = req;

        // costruzione Response
        const respSuc = new Response();
        respSuc.statusCode = '200'
        respSuc.description = 'Successful operation'
        respSuc.content = content;
        opC.responses.push(respSuc)
        const respFail = new Response();
        respFail.statusCode = '405'
        respFail.description = 'Invalid input'
        opC.responses.push(respFail)

        window.operKeyJSONMap.set(`create${ent}`, opC)



        // UPDATE -------------------

        const opU = new OpenApiOperation();
        opU.id = `update${ent}`
        opU.description = `Update an existent ${ent} by ID`
        opU.tags = [ entLC ]
        opU.method = 'put'
        opU.summary = `Update an existent ${ent}`

        // costruzione RequestBody
        // schema e content analoghi al precedente
        const reqU = new RequestBody();
        reqU.required = true;
        reqU.description = `Update an existent ${ent}`
        reqU.content = content
        opU.requestBody = reqU;

        // costruzione Response
        // resp successo analoga a prima
        opU.responses.push(respSuc)
        const respFail1 = new Response();
        respFail1.statusCode = '400'
        respFail1.description = 'Invalid ID supplied'
        opU.responses.push(respFail1)
        const respFail2 = new Response();
        respFail2.statusCode = '404'
        respFail2.description = `${ent} not found`
        opU.responses.push(respFail2)
        const respFail3 = new Response();
        respFail3.statusCode = '405'
        respFail3.description = 'Validation exception'
        opU.responses.push(respFail3)

        window.operKeyJSONMap.set(`update${ent}`, opU)


        // RETRIEVE -------------------

        const opR = new OpenApiOperation();
        opR.id = `retrieve${ent}`
        opR.description = `Retrieve an existent ${ent} by ID`
        opR.tags = [ entLC ]
        opR.method = 'get'
        opR.summary = `Retrieve a ${ent}`

        // costruzione parametri
        const param = new Parameter();
        param.name = `${entLC}Id`
        param.intype = 'path'
        param.description = `Id of the ${ent} to return`
        param.required = true
        const schemaParam = new Schema();
        schemaParam.type = 'integer'
        schemaParam.format = 'int64'
        param.schema = schemaParam

        opR.parameters.push(param)

        // costruzione Response
        // resp successo, 400 e 404, analogh a prima
        opR.responses.push(respSuc)
        opR.responses.push(respFail1)
        opR.responses.push(respFail2)

        window.operKeyJSONMap.set(`retrieve${ent}`, opR)



        // DELETE -------------------

        const opD = new OpenApiOperation();
        opD.id = `delete${ent}`
        opD.description = `Delete an existent ${ent} by ID`
        opD.tags = [ entLC ]
        opD.method = 'delete'
        opD.summary = `Delete a ${ent}`

        // costruzione parametri
        const paramDel = new Parameter();
        paramDel.name = `${entLC}Id`
        paramDel.intype = 'path'
        paramDel.description = `Id of the ${ent} to delete`
        paramDel.required = true
        // schema analogo al precedente
        paramDel.schema = schemaParam

        opD.parameters.push(paramDel)

        // costruzione Response
        // resp 400 analoga a prima
        opD.responses.push(respFail1)

        window.operKeyJSONMap.set(`delete${ent}`, opD)
    })


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