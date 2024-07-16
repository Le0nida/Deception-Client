package cybersec.deception.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cybersec.deception.client.services.PersistenceService;
import cybersec.deception.client.utils.Utils;
import cybersec.deception.client.utils.ZipUtils;
import cybersec.deception.model.ServerBuildResponse;
import cybersec.deception.model.apispecification.Tag;
import cybersec.deception.model.logmodel.LogRequest;
import cybersec.deception.model.logmodel.LogResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
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

    @PostMapping("/generateServer")
    public ResponseEntity<byte[]> setTags(@RequestBody Map<String, Object> data, HttpSession session) {
        String yamlSpecString = (String) session.getAttribute("finalYaml");
        String url = deamonPath + generateServerApi;

        boolean useDb = (boolean) data.get("persistence");
        boolean docs = (boolean) data.get("docs");
        String basePath = (String) data.get("basePath");
        boolean sessionBool = (boolean) data.get("sessionBool");
        boolean vulnBool = (boolean) data.get("vulnBool");
        String jwtAuthPaths = (String) data.get("jwtAuthPaths");
        String jwtUser = (String) data.get("jwtUser");
        String jwtPassword = (String) data.get("jwtPass");
        String notAuthPaths = (String) data.get("notAuthPaths");
        String adminCredentialsUser = (String) data.get("adminCredentialsUser");
        String adminCredentialsPass = (String) data.get("adminCredentialsPass");
        Map<String, String> attributesMap = getRequestAttributes(session);

        // Configura il corpo della richiesta
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("yamlSpecString", yamlSpecString);
        requestBody.put("persistence", useDb);
        requestBody.put("basePath", basePath);
        requestBody.put("docs", docs);
        if (session.getAttribute("securityConfig") != null) {
            String jsonString = null;
            ObjectMapper mapper = new ObjectMapper();
            try {
                jsonString = mapper.writeValueAsString(session.getAttribute("securityConfig"));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            requestBody.put("securityConfig", jsonString);
        }
        requestBody.put("sessionBool", sessionBool);
        requestBody.put("vulnBool", vulnBool);
        requestBody.put("jwtAuthPaths", Utils.isNullOrEmpty(jwtAuthPaths) ? null : jwtAuthPaths);
        if (!Utils.isNullOrEmpty(jwtAuthPaths)){
            requestBody.put("jwtUser", Utils.isNullOrEmpty(jwtUser) ? null : jwtUser);
            requestBody.put("jwtPassword", Utils.isNullOrEmpty(jwtPassword) ? null : jwtPassword);
        }
        requestBody.put("notAuthPaths", Utils.isNullOrEmpty(notAuthPaths) ? null : notAuthPaths);
        requestBody.put("adminCredentialsUser", Utils.isNullOrEmpty(adminCredentialsUser) ? null : adminCredentialsUser);
        requestBody.put("adminCredentialsPass", Utils.isNullOrEmpty(adminCredentialsPass) ? null : adminCredentialsPass);
        requestBody.put("mockarooRequestsMap", attributesMap.isEmpty() ? null : attributesMap);

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

    // Salva in sessione il file yaml
    @PostMapping("/extraFeatures")
    public ResponseEntity<String> setTags(@RequestBody String data, HttpSession session) {
        session.setAttribute("reviewedFinalYaml", data);
        return ResponseEntity.ok("extraFeatures");
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
        if (!Utils.isNullOrEmpty(logRequest.getFilter().getTimestamp())) {
            String timestamp = LocalDateTime.parse(logRequest.getFilter().getTimestamp()).toString();
            logRequest.getFilter().setTimestamp(timestamp);
        }
        HttpEntity<LogRequest> requestEntity = new HttpEntity<>(logRequest, headers);
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());


        return restTemplate.postForEntity(data.get("urlLog"), requestEntity, LogResponse.class);
    }

    // Visualizzazione pagina insights
    @GetMapping("/log_analysis")
    public String logs() {
        return "log_analysis";
    }

    private Map<String, String> getRequestAttributes(HttpSession session) {
        Map<String, String> attributesMap = new HashMap<>();

        Enumeration<String> attributeNames = session.getAttributeNames();
        while (attributeNames.hasMoreElements()) {
            String attributeName = attributeNames.nextElement();
            if (attributeName.startsWith("request")) {
                String attributeValue = (String) session.getAttribute(attributeName);
                attributesMap.put(attributeName, attributeValue);
            }
        }

        return attributesMap;
    }
}
