const defaultBackgroundColor = "rgba(195, 210, 243, 0.42)";

function showHiddenElement(id) {
    document.getElementById(id).classList.remove('hidden');
}
function hideShownElement(id) {
    document.getElementById(id).classList.add('hidden');
}
function showDisplayNoneElement(id) {
    document.getElementById(id).style.display = 'block';
}
function hideDisplayBlockElement(id) {
    document.getElementById(id).style.display = 'none';
}
function isNotEmptyString(value) {
    return !(value == null || value.trim() == null || value.trim() === '');
}

function isEmptyString(value) {
    return !isNotEmptyString(value);
}

function emptyDiv(id) {
    const container = document.getElementById(id);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function resetButtonBackground(container) {
    const buttons = container.getElementsByTagName('button');
    for (const button of buttons) {
        button.style.backgroundColor = defaultBackgroundColor;
        button.disabled = false;
    }
}

function addButton(btnText, containerID, btnFunction){

    const container = document.getElementById(containerID);
    const newButton = document.createElement('button');
    newButton.innerText = btnText;

    if (btnFunction === null){
        newButton.disabled = true;
    }
    else {
        newButton.onclick = function () {
            resetButtonBackground(container); // Imposta il colore di sfondo predefinito su tutti i bottoni nel container
            btnFunction(btnText);
            newButton.style.backgroundColor = 'yellow'
            newButton.disabled = true;
        };
    }

    container.appendChild(newButton);
}

function isValueInMapKeys(map, value) {
    return Array.from(map.keys()).includes(value);
}

class OpenApiOperation {
    constructor(id, tags, method, description, summary, parameters, requestBody, responses, security) {
        this.id = id || '';
        this.tags = tags || [];
        this.method = method || '';
        this.description = description || '';
        this.summary = summary || '';
        this.parameters = parameters || [];
        this.requestBody = requestBody || null;
        this.responses = responses || [];
        this.security = security || [];
    }
}

class Response {
    constructor(statusCode, description, content) {
        this.statusCode = statusCode;
        this.description = description || '';
        this.content = content || {};
    }
}

class RequestBody {
    constructor(description, content, required) {
        this.description = description || '';
        this.content = content || {};
        this.required = required || false;
    }
}

class Content {
    constructor(type, schema) {
        this.type = type;
        this.schema = schema || {}
    }
}

class Parameter {
    constructor(name, intype, description, required, allowEmptyValue,schema) {
        this.name = name;
        this.intype = intype;
        this.description = description;
        this.required = required || true;
        this.allowEmptyValue = allowEmptyValue || false;
        this.schema = schema || {}
    }
}

class Schema {
    constructor(type, format, reference, items) {
        this.type = type;
        this.format = format;
        this.reference = reference;
        this.items = items || []
    }
}

class Tag {
    constructor() {
        this.name = '';
        this.description = '';
        this.paths = [];
    }
}

class Path {
    constructor() {
        this.path = '';
        this.operations = [];
    }
}
