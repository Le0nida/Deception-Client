package cybersec.deception.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cybersec.deception.client.services.PersistenceService;
import cybersec.deception.client.utils.ZipUtils;
import cybersec.deception.model.ServerBuildResponse;
import cybersec.deception.model.Tag;
import cybersec.deception.model.logmodel.LogRequest;
import cybersec.deception.model.logmodel.LogResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.*;

@Controller
public class InnerController {

    @Value("${deamon.path}")
    private String deamonPath;

    @Value("${deamon.generateserver.api}")
    private String generateServerApi;
    private final PersistenceService persistenceService;
    @Autowired
    public InnerController(PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    // Salva in sessione i tag, con relativi path e operazioni
    @PostMapping("/generateServer")
    public ResponseEntity<byte[]> setTags(@RequestBody Map<String, Object> data, HttpSession session) {
        String yamlSpecString = (String) session.getAttribute("finalYaml");
        String url = deamonPath + generateServerApi;

        boolean useDb = (boolean) data.get("persistence");
        boolean docs = (boolean) data.get("docs");
        String basePath = (String) data.get("basePath");

        // Configura il corpo della richiesta
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("yamlSpecString", yamlSpecString);
        requestBody.put("persistence", useDb);
        requestBody.put("basePath", basePath);
        requestBody.put("docs", docs);

        // Configura l'header della richiesta
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Configura l'entità della richiesta
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<ServerBuildResponse> responseEntity = restTemplate.postForEntity(url, requestEntity, ServerBuildResponse.class);
            byte[] finalZip = ZipUtils.createCombinedZip(Objects.requireNonNull(responseEntity.getBody()));

            return ResponseEntity.ok(finalZip);
        } catch (Exception e) {
            System.out.println("Errore durante la chiamata all'endpoint: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Salva in sessione i tag, con relativi path e operazioni
    @PostMapping("/setTags")
    public ResponseEntity<String> setTags(@RequestBody List<Tag> data, HttpSession session) {
        session.setAttribute("tagList", data);
        return ResponseEntity.ok("reviewPage");
    }

    // Import & Save - OpenApi specification
    // L'import corrisponde alla funzionalità 3 nel Main Controller
    @PostMapping("/setSpecification")
    public ResponseEntity<String> setSpecification(@RequestBody Map<String, String> data, HttpSession session) {
        String filename = data.get("filename");
        String yaml = data.get("yaml");
        String response = this.persistenceService.uploadYaml(yaml, filename, (String) session.getAttribute("username"));
        return ResponseEntity.ok(response);
    }

    // Import & Save - General infos
    @PostMapping("/getGeneralInfos")
    public ResponseEntity<String> getGeneralInfos(@RequestBody String filename, HttpSession session) {
        String generalInfo = this.persistenceService.retrieveGeneralInfo(filename, (String) session.getAttribute("username"));
        return ResponseEntity.ok(generalInfo);
    }

    @PostMapping("/setGeneralInfos")
    public ResponseEntity<String> setGeneralInfos(@RequestBody Map<String, String> data, HttpSession session) {
        String filename = data.get("filename");
        String generalInfo = data.get("generalInfo");
        String response = this.persistenceService.uploadGeneralInfo(generalInfo, filename, (String) session.getAttribute("username"));
        return ResponseEntity.ok(response);
    }

    // Import & Save - Security schemes
    @PostMapping("/getSecurityScheme")
    public ResponseEntity<String> getSecurityScheme(@RequestBody String filename, HttpSession session) {
        String securityScheme = this.persistenceService.retrieveSecurityScheme(filename, (String) session.getAttribute("username"));
        return ResponseEntity.ok(securityScheme);
    }

    @PostMapping("/setSecurityScheme")
    public ResponseEntity<String> setSecurityScheme(@RequestBody Map<String, String> data, HttpSession session) {
        String filename = data.get("filename");
        String securityScheme = data.get("securityScheme");
        String response = this.persistenceService.uploadSecurityScheme(securityScheme, filename, (String) session.getAttribute("username"));
        return ResponseEntity.ok(response);
    }

    // Gestione POJO - reset e update
    @PostMapping("/resetPojos")
    public String resetPojos(HttpSession session) {
        Enumeration<String> attributeNames = session.getAttributeNames();

        while (attributeNames.hasMoreElements()) {
            String attributeName = attributeNames.nextElement();
            if (attributeName.startsWith("currentPojo")) {
                session.removeAttribute(attributeName);
            }
        }
        return "schemaDefinition";
    }

    @PostMapping("/updatePojoModel")
    public ResponseEntity<String> updatePojoModel(@RequestBody Map<String, String> data, HttpSession session) {
        // Ottieni il valore dal corpo della richiesta
        String valoreDaAggiornare = data.get("valoreDaAggiornare");
        String attributoDaAggiornare = data.get("attributoDaAggiornare");
        session.setAttribute(attributoDaAggiornare, valoreDaAggiornare);
        return ResponseEntity.ok("Modello aggiornato con successo");
    }

    @PostMapping("/getLogs")
    public ResponseEntity<LogResponse> getLogs(@RequestBody Map<String, String> data) {


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Converte la stringa JSON in un oggetto LogRequest
        ObjectMapper objectMapper = new ObjectMapper();
        LogRequest logRequest;
        try {
            logRequest = objectMapper.readValue(data.get("logRequest"), LogRequest.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

        HttpEntity<LogRequest> requestEntity = new HttpEntity<>(logRequest, headers);
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());

        ResponseEntity<LogResponse> response = restTemplate.postForEntity(data.get("urlLog"), data.get("logRequest"), LogResponse.class);


        return response;
    }
}
