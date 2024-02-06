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
        this.identifier = "";
    }
}

class Server {
    constructor() {
        this.url = "";
        this.description = "";
    }
}
