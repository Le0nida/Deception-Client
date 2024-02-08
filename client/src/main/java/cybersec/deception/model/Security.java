package cybersec.deception.model;

import java.util.List;

public class Security {

    private String securitySchemaName;

    private List<String> scopes;

    public String getSecuritySchemaName() {
        return securitySchemaName;
    }

    public void setSecuritySchemaName(String securitySchemaName) {
        this.securitySchemaName = securitySchemaName;
    }

    public List<String> getScopes() {
        return scopes;
    }

    public void setScopes(List<String> scopes) {
        this.scopes = scopes;
    }
}
