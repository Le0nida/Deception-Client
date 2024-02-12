package cybersec.deception.client.services;

import cybersec.deception.client.utils.Utils;
import cybersec.deception.model.apispecification.OAuthFlows;
import cybersec.deception.model.apispecification.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;

import java.util.Map;

@Service
public class EntitiesService {

    @Value("${deamon.path}")
    private String deamonPath;

    @Value("${deamon.retrieveentities.api}")
    private String retrieveEntitiesApi;
    public String defineYamlComponents(Map<String, String> entitiesMap, SecurityScheme scheme) {

        // Imposta le opzioni per la formattazione YAML
        DumperOptions dumperOptions = new DumperOptions();
        dumperOptions.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK);
        dumperOptions.setPrettyFlow(true);

        // Crea un oggetto Yaml con le opzioni di formattazione
        Yaml yaml = new Yaml(dumperOptions);

        // Inizia a costruire la rappresentazione YAML
        StringBuilder yamlStringBuilder = new StringBuilder();
        yamlStringBuilder.append("  schemas:\n");
        // Aggiungi le informazioni per ciascun componente dalla mappa
        for (Map.Entry<String, String> entry : entitiesMap.entrySet()) {
            String componentName = entry.getKey();
            String json = entry.getValue();

            yamlStringBuilder.append("    ").append(componentName).append(":\n");
            yamlStringBuilder.append("      type: object\n");
            yamlStringBuilder.append("      properties:\n");
            yamlStringBuilder.append("        id:\n");
            yamlStringBuilder.append("          type: integer\n");
            yamlStringBuilder.append("          format: int64\n");
            yamlStringBuilder.append("          description: id autoincrementale\n");
            yamlStringBuilder.append("          example: 10\n");

            // Converte l'esempio JSON in un oggetto mappa
            Map<String, Object> jsonMap = yaml.load(json);

            // Aggiungi ciascuna proprietà come chiave-valore nella sezione example
            for (Map.Entry<String, Object> propertyEntry : jsonMap.entrySet()) {
                if (propertyEntry.getKey().equalsIgnoreCase("id")) continue;
                yamlStringBuilder.append("        ").append(propertyEntry.getKey()).append(":\n");
                yamlStringBuilder.append("          type: string\n");
                yamlStringBuilder.append("          example: ").append(propertyEntry.getValue()).append("\n");
            }
        }

        // aggiungo l'unico schema di sicurezza
        if (scheme != null) {
            yamlStringBuilder.append("  securitySchemes:\n");
            yamlStringBuilder.append("    ").append("defaultsecurity").append(":\n");
            yamlStringBuilder.append("      type: ").append(scheme.getType()).append("\n");
            if (!Utils.isNullOrEmpty(scheme.getDescription())) {
                yamlStringBuilder.append("      description: ").append(scheme.getDescription()).append("\n");
            }
            if (!Utils.isNullOrEmpty(scheme.getName())) {
                yamlStringBuilder.append("      name: ").append(scheme.getName()).append("\n");
            }
            if (!Utils.isNullOrEmpty(scheme.getIn())) {
                yamlStringBuilder.append("      in: ").append(scheme.getIn()).append("\n");
            }
            if (!Utils.isNullOrEmpty(scheme.getScheme())) {
                yamlStringBuilder.append("      scheme: ").append(scheme.getScheme()).append("\n");
            }
            if (!Utils.isNullOrEmpty(scheme.getBearerFormat())) {
                yamlStringBuilder.append("      bearerFormat: ").append(scheme.getBearerFormat()).append("\n");
            }
            if (!Utils.isNullOrEmpty(scheme.getOpenIdConnectUrl())) {
                yamlStringBuilder.append("      openIdConnectUrl: ").append(scheme.getOpenIdConnectUrl()).append("\n");
            }

            OAuthFlows o = scheme.getFlows();
            if (o != null && (o.getImplicit() != null || o.getAuthorizationCode() != null || o.getPassword() != null || o.getClientCredentials() != null)) {
                yamlStringBuilder.append("      flows: ").append("\n");
                if (o.getAuthorizationCode() != null) {
                    yamlStringBuilder.append("        authorizationCode: ").append("\n");
                    yamlStringBuilder.append("          authorizationUrl: ").append(o.getAuthorizationCode().getAuthorizationUrl()).append("\n");
                    yamlStringBuilder.append("          tokenUrl: ").append(o.getAuthorizationCode().getTokenUrl()).append("\n");
                    if (!Utils.isNullOrEmpty(o.getAuthorizationCode().getRefreshUrl())) {
                        yamlStringBuilder.append("          refreshUrl: ").append(o.getAuthorizationCode().getRefreshUrl()).append("\n");
                    }
                    if (!Utils.isNullOrEmpty(o.getAuthorizationCode().getScopes())) {
                        yamlStringBuilder.append("          scopes: ").append("\n");
                        for (Map.Entry<String, String> entry: o.getAuthorizationCode().getScopes().entrySet()) {
                            yamlStringBuilder.append("            ").append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
                        }
                    }
                }

                if (o.getImplicit() != null) {
                    yamlStringBuilder.append("        implicit: ").append("\n");
                    yamlStringBuilder.append("          authorizationUrl: ").append(o.getImplicit().getAuthorizationUrl()).append("\n");
                    if (!Utils.isNullOrEmpty(o.getImplicit().getRefreshUrl())) {
                        yamlStringBuilder.append("          refreshUrl: ").append(o.getImplicit().getRefreshUrl()).append("\n");
                    }
                    if (!Utils.isNullOrEmpty(o.getImplicit().getScopes())) {
                        yamlStringBuilder.append("          scopes: ").append("\n");
                        for (Map.Entry<String, String> entry: o.getImplicit().getScopes().entrySet()) {
                            yamlStringBuilder.append("            ").append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
                        }
                    }
                }
                if (o.getPassword() != null) {
                    yamlStringBuilder.append("        password: ").append("\n");
                    yamlStringBuilder.append("          tokenUrl: ").append(o.getPassword().getTokenUrl()).append("\n");
                    if (!Utils.isNullOrEmpty(o.getPassword().getRefreshUrl())) {
                        yamlStringBuilder.append("          refreshUrl: ").append(o.getPassword().getRefreshUrl()).append("\n");
                    }
                    if (!Utils.isNullOrEmpty(o.getPassword().getScopes())) {
                        yamlStringBuilder.append("          scopes: ").append("\n");
                        for (Map.Entry<String, String> entry: o.getPassword().getScopes().entrySet()) {
                            yamlStringBuilder.append("            ").append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
                        }
                    }
                }
                if (o.getClientCredentials() != null) {
                    yamlStringBuilder.append("        clientCredentials: ").append("\n");
                    yamlStringBuilder.append("          tokenUrl: ").append(o.getClientCredentials().getTokenUrl()).append("\n");
                    if (!Utils.isNullOrEmpty(o.getClientCredentials().getRefreshUrl())) {
                        yamlStringBuilder.append("          refreshUrl: ").append(o.getClientCredentials().getRefreshUrl()).append("\n");
                    }
                    if (!Utils.isNullOrEmpty(o.getClientCredentials().getScopes())) {
                        yamlStringBuilder.append("          scopes: ").append("\n");
                        for (Map.Entry<String, String> entry: o.getClientCredentials().getScopes().entrySet()) {
                            yamlStringBuilder.append("            ").append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
                        }
                    }
                }
            }
        }
        return yamlStringBuilder.toString();
    }

    public ResponseEntity<Map> retrieveAllEntities() {
        String otherProjectUrl = deamonPath + retrieveEntitiesApi;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> responseEntity = restTemplate.getForEntity(otherProjectUrl, Map.class);
        return responseEntity;
    }
}
