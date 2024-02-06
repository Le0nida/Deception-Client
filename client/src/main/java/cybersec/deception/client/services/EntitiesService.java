package cybersec.deception.client.services;

import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;

import java.util.Map;

@Service
public class EntitiesService {
    public String defineYamlComponents(Map<String, String> entitiesMap) {

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

        return yamlStringBuilder.toString();
    }

    public ResponseEntity<Map> retrieveAllEntities() {
        String otherProjectUrl = "http://localhost:8080/api/entities/retrieveAll"; // Cambia l'URL con quello effettivo dell'altro progetto
        RestTemplate restTemplate = new RestTemplate();

        // Esegui la chiamata HTTP per ottenere la mappa di contenuti
        ResponseEntity<Map> responseEntity = restTemplate.getForEntity(otherProjectUrl, Map.class);

        // Ottieni lo stato HTTP dalla risposta
        HttpStatusCode statusCode = responseEntity.getStatusCode();

        // Ottieni il corpo della risposta
        return responseEntity;
    }
}
