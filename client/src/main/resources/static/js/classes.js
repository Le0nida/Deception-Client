class ApiSpec {
    constructor() {
        this.openapi = "";
        this.info = new Info();
        this.externalDocs = new ExternalDocs();
        this.servers = [];
    }
}

class Info {
    constructor() {
        this.title = "";
        this.description = "";
        this.termsOfService = "";
        this.version = "";
        this.license = new License();
        this.contact = new Contact();
    }
}

class ExternalDocs {
    constructor() {
        this.description = "";
        this.url = "";
    }
}

class Contact {
    constructor() {
        this.name = "";
        this.url = "";
        this.email = "";
    }
}

class License {
    constructor() {
        this.name = "";
        this.url = "";
    }
}

class Server {
    constructor() {
        this.url = "";
        this.description = "";
    }
}

class SecurityScheme {
    constructor(type, description, name, inValue, scheme, bearerFormat, openIdConnectUrl, flows) {
        this.type = type;
        this.description = description;
        this.name = name;
        this.in = inValue;
        this.scheme = scheme;
        this.bearerFormat = bearerFormat;
        this.openIdConnectUrl = openIdConnectUrl;
        this.flows = flows;
    }
}

class OAuthFlows {
    constructor(authorizationCode, implicit, password, clientCredentials) {
        this.authorizationCode = authorizationCode;
        this.implicit = implicit;
        this.password = password;
        this.clientCredentials = clientCredentials;
    }
}

class OAuthFlow {
    constructor(authorizationUrl, tokenUrl, refreshUrl, scopes) {
        this.authorizationUrl = authorizationUrl;
        this.tokenUrl = tokenUrl;
        this.refreshUrl = refreshUrl;
        this.scopes = scopes;
    }
}
