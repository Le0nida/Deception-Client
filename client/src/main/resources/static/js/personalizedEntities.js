let entities = [];
document.addEventListener("DOMContentLoaded", function() {
    $('#continue').click(function () {
        handleContinueButton()
    });

    $('#reset').click(function () {
        entities = [];
        // TODO
    });


    document.getElementById('createEntityBtn').addEventListener('click', function() {
        document.getElementById('entityDialog').style.display = 'block';
    });

    document.getElementById('addFieldBtn').addEventListener('click', function() {
        let fieldsContainer = document.getElementById('fieldsContainer');
        let newFieldRow = document.createElement('div');
        newFieldRow.className = 'fieldRow';
        newFieldRow.innerHTML = `
                <input type="text" class="fieldName" placeholder="Nome Campo" required>
                <select class="fieldType">
                    <option value="string">Stringa</option>
                    <option value="number">Numero</option>
                    <option value="date">Data</option>
                </select>
            `;
        fieldsContainer.appendChild(newFieldRow);
    });

    document.getElementById('saveEntityBtn').addEventListener('click', function() {
        let entityName = document.getElementById('entityName').value;
        let fields = document.querySelectorAll('.fieldRow');
        let fieldNames = Array.from(fields).map(field => field.querySelector('.fieldName').value);

        if (new Set(fieldNames).size !== fieldNames.length) {
            alert('I nomi dei campi devono essere unici!');
            return;
        }

        let entity = {
            name: entityName,
            fields: fieldNames.map((name, index) => ({
                name: name,
                type: fields[index].querySelector('.fieldType').value
            }))
        };

        entities.push(entity);

        addEntityToList(entity);
        closeDialog();
    });

});

function handleContinueButton() {
    // Creare un oggetto con i dati da inviare
    const data = {
        step: 'sec',
        entities: JSON.stringify(entities, null, 2)
    };

    $.ajax({
        type: 'POST',
        url: 'creazioneSpecifica',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            window.location.href = 'securityScheme'
        },
        error: function (error) {
            console.error('Error:', error);
            alert("Error while proceeding to the next step")
        }
    });
}


function addEntityToList(entity) {
    let entityList = document.getElementById('entityList');
    let entityDiv = document.createElement('div');
    entityDiv.className = 'entity';
    entityDiv.innerHTML = `<h3>${entity.name}</h3><ul>${entity.fields.map(field => `<li>${field.name} (${field.type})</li>`).join('')}</ul>`;
    entityList.appendChild(entityDiv);
}

function closeDialog() {
    document.getElementById('entityDialog').style.display = 'none';
    document.getElementById('entityName').value = '';
    document.getElementById('fieldsContainer').innerHTML = `
                <div class="fieldRow">
                    <input type="text" class="fieldName" placeholder="Nome Campo" required>
                    <select class="fieldType">
                        <option value="string">Stringa</option>
                        <option value="number">Numero</option>
                        <option value="date">Data</option>
                    </select>
                </div>
            `;
}