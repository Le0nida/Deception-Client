

function initializeWorkstation() {
    const tagName = "Workstation";
    const tagNameLC = tagName.toLowerCase()

    if (!isValueInMapKeys(tagKeyDescMap, tagNameLC)) {
        // Significa che NON è gia settato il tag User
        // aggiungo il tag
        window.tagKeyDescMap.set(tagNameLC, tagName + " management")
        // aggiungo i paths
        window.pathMap.set(tagNameLC, [`/${tagNameLC}/accessWorkstation`] )
    }

    // aggiungo i paths (a quelli già presenti)
    let paths = window.pathMap.get(tagNameLC);
    paths.push(`/${tagNameLC}/accessWorkstation`)

    // aggiungo le operazioni
    window.operationsMap.set(`/${tagNameLC}/access${tagName}`, [`access${tagName}`])

    // LOGIN -----------------
    const opC = new OpenApiOperation();
    opC.id = `access${tagName}`
    opC.description = `Access into workstation shell`
    opC.tags = [ tagNameLC ]
    opC.method = 'get'
    opC.summary = `Access into workstation shell`

    const schema = new Schema();
    schema.type = "string"
    const content = new Content();
    content.type = 'application/json'
    content.schema = schema;

    // costruzione parametri
    const param1 = new Parameter();
    param1.name = 'workstation'
    param1.intype = 'query'
    param1.description = 'The workstation id'
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
    respFail.description = 'Invalid id/password supplied'
    opC.responses.push(respFail)

    window.operKeyJSONMap.set(`access${tagName}`, opC)
}

function initializeLoginOut() {
    const tagName = "User";
    const tagNameLC = tagName.toLowerCase()

    if (!isValueInMapKeys(tagKeyDescMap, tagNameLC)) {
        // Significa che NON è gia settato il tag User
        // aggiungo il tag
        window.tagKeyDescMap.set(tagNameLC, tagName + " management")
        // aggiungo i paths
        window.pathMap.set(tagNameLC, [`/${tagNameLC}/login`, `/${tagNameLC}/logout`, `/${tagNameLC}/admin`] )
    }

    // aggiungo i paths (a quelli già presenti)
    let userPaths = window.pathMap.get(tagNameLC);
    userPaths.push(`/${tagNameLC}/login`)
    userPaths.push(`/${tagNameLC}/logout`)
    userPaths.push(`/${tagNameLC}/admin`)

    // aggiungo le operazioni
    window.operationsMap.set(`/${tagNameLC}/login`, [`login${tagName}`])
    window.operationsMap.set(`/${tagNameLC}/logout`, [`logout${tagName}`])
    window.operationsMap.set(`/${tagNameLC}/admin`, [`loginAdmin`])

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


    // LOGOUT -----------------
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


    // ADMIN -----------------
    const opA = new OpenApiOperation();
    opA.id = `loginAdmin`
    opA.description = `Logs the ${tagName} into the admin page`
    opA.tags = [ tagNameLC ]
    opA.method = 'get'
    opA.summary = `Login for admin`

    // costruzione parametri
    const param3 = new Parameter();
    param3.name = 'username'
    param3.intype = 'query'
    param3.description = 'The username for admin'
    param3.required = true
    param3.schema = schema
    opA.parameters.push(param3)

    const param4 = new Parameter();
    param4.name = 'password'
    param4.intype = 'query'
    param4.description = 'The password for admin in clear text'
    param4.required = true
    param4.schema = schema
    opA.parameters.push(param4)

    // costruzione Response
    opA.responses.push(respSuc)
    opA.responses.push(respFail)

    window.operKeyJSONMap.set(`loginAdmin`, opA)
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

function initializeTransaction() {
    const tagName = "Transaction";
    const tagNameLC = tagName.toLowerCase()

    if (!isValueInMapKeys(tagKeyDescMap, tagNameLC)) {
        // Significa che NON è gia settato il tag User
        // aggiungo il tag
        window.tagKeyDescMap.set(tagNameLC, tagName + " management")
        // aggiungo i paths
        window.pathMap.set(tagNameLC, [`/${tagNameLC}/transferMoney`] )
        window.pathMap.set(tagNameLC, [`/${tagNameLC}/requestMoney`] )
    }

    // aggiungo i paths (a quelli già presenti)
    let paths = window.pathMap.get(tagNameLC);
    paths.push(`/${tagNameLC}/transferMoney`)
    paths.push(`/${tagNameLC}/requestMoney`)

    // aggiungo le operazioni
    window.operationsMap.set(`/${tagNameLC}/transferMoney`, [`transferMoney`])
    window.operationsMap.set(`/${tagNameLC}/requestMoney`, [`requestMoney`])

    // transferMoney -----------------
    const opC = new OpenApiOperation();
    opC.id = `transferMoney`
    opC.description = `Create a new money transaction`
    opC.tags = [ tagNameLC ]
    opC.method = 'post'
    opC.summary = `Send money`

    /// costruzione parametri
    const param = new Parameter();
    param.name = `senderId`
    param.intype = 'path'
    param.description = `Id of the sender`
    param.required = true
    const schemaParam = new Schema();
    schemaParam.type = 'integer'
    schemaParam.format = 'int64'
    param.schema = schemaParam

    opC.parameters.push(param)

    const schema = new Schema();
    schema.type = "string"
    const content = new Content();
    content.type = 'application/json'
    content.schema = schema;

    const param1 = new Parameter();
    param1.name = 'receiver_name'
    param1.intype = 'query'
    param1.description = 'The receiver name'
    param1.required = true
    param1.schema = schema
    opC.parameters.push(param1)

    const param2 = new Parameter();
    param2.name = 'receiver_iban'
    param2.intype = 'query'
    param2.description = 'The IBAN of the receiver'
    param2.required = true
    param2.schema = schema
    opC.parameters.push(param2)

    const param3 = new Parameter();
    param3.name = 'amount'
    param3.intype = 'query'
    param3.description = 'The amount to send'
    param3.required = true
    param3.schema = schema
    opC.parameters.push(param3)

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
    const respFail1 = new Response();
    respFail1.statusCode = '400'
    respFail1.description = 'Invalid sender ID supplied'
    opC.responses.push(respFail1)

    window.operKeyJSONMap.set(`transferMoney`, opC)



    // requestMoney -----------------
    const opR = new OpenApiOperation();
    opR.id = `requestMoney`
    opR.description = `Create a new money request`
    opR.tags = [ tagNameLC ]
    opR.method = 'post'
    opR.summary = `Request money`

    /// costruzione parametri
    opR.parameters.push(param1)
    opR.parameters.push(param2)
    opR.parameters.push(param3)

    // costruzione Response
    opR.responses.push(respSuc)
    opR.responses.push(respFail)

    window.operKeyJSONMap.set(`requestMoney`, opR)
}


function initializeCrypto() {
    const tagName = "Crypto";
    const tagNameLC = tagName.toLowerCase()

    if (!isValueInMapKeys(tagKeyDescMap, tagNameLC)) {
        // Significa che NON è gia settato il tag User
        // aggiungo il tag
        window.tagKeyDescMap.set(tagNameLC, tagName + " management")
        // aggiungo i paths
        window.pathMap.set(tagNameLC, [`/${tagNameLC}/transfer`] )
    }

    // aggiungo i paths (a quelli già presenti)
    let paths = window.pathMap.get(tagNameLC);
    paths.push(`/${tagNameLC}/transfer`)

    // aggiungo le operazioni
    window.operationsMap.set(`/${tagNameLC}/transfer`, [`transfer`])

    // transferMoney -----------------
    const opC = new OpenApiOperation();
    opC.id = `transfer`
    opC.description = `Transfer money`
    opC.tags = [ tagNameLC ]
    opC.method = 'post'
    opC.summary = `Transfer money`

    /// costruzione parametri
    const schema = new Schema();
    schema.type = "string"
    const content = new Content();
    content.type = 'application/json'
    content.schema = schema;

    const param1 = new Parameter();
    param1.name = 'sender_address'
    param1.intype = 'query'
    param1.description = 'The sender address'
    param1.required = true
    param1.schema = schema
    opC.parameters.push(param1)

    const param2 = new Parameter();
    param2.name = 'receiver_address'
    param2.intype = 'query'
    param2.description = 'The receiver address'
    param2.required = true
    param2.schema = schema
    opC.parameters.push(param2)

    const param3 = new Parameter();
    param3.name = 'amount'
    param3.intype = 'query'
    param3.description = 'The amount to transfer'
    param3.required = true
    param3.schema = schema
    opC.parameters.push(param3)

    const param4 = new Parameter();
    param4.name = 'currency'
    param4.intype = 'query'
    param4.description = 'The currency type'
    param4.required = true
    param4.schema = schema
    opC.parameters.push(param4)

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
    const respFail1 = new Response();
    respFail1.statusCode = '400'
    respFail1.description = 'Invalid sender/receiver supplied'
    opC.responses.push(respFail1)

    window.operKeyJSONMap.set(`transfer`, opC)
}