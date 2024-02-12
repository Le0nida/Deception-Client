package cybersec.deception.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cybersec.deception.client.services.EntitiesService;
import cybersec.deception.client.services.PersistenceService;
import cybersec.deception.client.utils.Utils;
import cybersec.deception.model.*;
import cybersec.deception.client.services.YamlBuilderService;
import cybersec.deception.model.apispecification.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Controller
public class MainController {

    @Value("${deamon.path}")
    private String deamonPath;

    @Value("${deamon.validateyaml.api}")
    private String validateYamlApi;

    private static final String REDIRECT = "redirect:/login";
    private final YamlBuilderService yamlService;
    private final EntitiesService entitiesService;
    private final PersistenceService persistenceService;
    public static List<String> pojoList;
    public static Map<String, String> pojoMap;

    @Autowired
    public MainController(YamlBuilderService yamlService, EntitiesService entitiesService, PersistenceService persistenceService) {
        this.yamlService = yamlService;
        this.entitiesService = entitiesService;
        this.persistenceService = persistenceService;
    }

    // HomePage
    @GetMapping("/")
    public String homePage(Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        cleanSession(session);

        List<String> files = this.persistenceService.retrieveAllYaml((String) session.getAttribute("username"));
        model.addAttribute("yamlFiles", files);

        return setPojos() ? "index" : "error";
    }

    private void cleanSession(HttpSession session) {
        java.util.Enumeration<String> attributeNames = session.getAttributeNames();
        while (attributeNames.hasMoreElements()) {
            String attributeName = attributeNames.nextElement();
            // Rimuovo tutti gli attributi tranne quello con il nome "username"
            if (!attributeName.equals("username")) {
                session.removeAttribute(attributeName);
            }
        }
    }

    // Funzionalità 1 (creazione di una specifica "from scratch")
    @PostMapping("/creazioneSpecifica")
    public String showSpecCreationPage(@RequestBody Map<String, Object> requestBody, Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }

        String step = (String) requestBody.get("step");

        if (step.equals("general")) {
            if (!Utils.isNullOrEmpty(pojoList) || setPojos()) {
                return "specificationInfos";
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare le informazioni JSON");
                return "errorpage";
            }
        } else if (step.equals("pojo")) {
            if (requestBody.get("apiSpec") != null) {
                // Creare un oggetto ObjectMapper
                ObjectMapper objectMapper = new ObjectMapper();

                // Convertire la stringa JSON in un oggetto ApiSpec
                ApiSpec apiSpec = null;
                try {
                    apiSpec = objectMapper.readValue(requestBody.get("apiSpec").toString(), ApiSpec.class);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
                session.setAttribute("apiSpec", apiSpec);
                return "schemaDefinition";
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare le informazioni JSON");
                return "errorpage";
            }
        } else if (step.equals("sec")) {
            List<String> pojos = (List<String>) requestBody.get("pojos");

            session.setAttribute("selectedPojos", pojos);
            if (Collections.list(session.getAttributeNames()).stream().anyMatch(name -> name.startsWith("currentPojo"))) {
                return "securityScheme";
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare lo schema definito");
                return "errorpage";
            }
        } else if (step.equals("paths")) {
            if (requestBody.get("securityScheme") !=  null) {
                // Creare un oggetto ObjectMapper
                ObjectMapper objectMapper = new ObjectMapper();

                SecurityScheme securityScheme = null;
                try {
                    securityScheme = objectMapper.readValue(requestBody.get("securityScheme").toString(), SecurityScheme.class);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
                session.setAttribute("securityScheme", securityScheme);

                if (requestBody.get("flowType") !=  null) {
                    SecurityConfig securityConfig = new SecurityConfig();
                    securityConfig.setFlowType(((String) requestBody.get("flowType")).toLowerCase());
                    securityConfig.setClient_id((String) requestBody.get("clientId"));
                    securityConfig.setClient_secret((String) requestBody.get("clientSecret"));
                    securityConfig.setAuthorizationUri((String) requestBody.get("authUrl"));
                    securityConfig.setTokenUri((String) requestBody.get("tokenUrl"));
                    securityConfig.setPassword((String) requestBody.get("password"));
                    securityConfig.setUsername((String) requestBody.get("username"));
                    if (!securityScheme.getFlows().getAuthorizationCode().getScopes().isEmpty()) {
                        securityConfig.setScopes(securityScheme.getFlows().getAuthorizationCode().getScopes().keySet().stream().toList());
                    }
                    session.setAttribute("securityConfig", securityConfig);
                }

                return "pathsDefinition";
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare lo schema definito");
                return "errorpage";
            }
        } else {
            return "errorpage";
        }
    }

    // Funzionalità 2 (import di uno schema dall'esterno)
    @PostMapping("/importScheme")
    public String importScheme(@RequestBody String yaml, Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        String formattedYaml = this.yamlService.formatYaml(yaml);
        session.setAttribute("finalYaml", formattedYaml);
        return "reviewPage";
    }

    // Funzionalità 3 (selezione di uno schema esistente)
    @PostMapping("/getSpecification")
    public String getSpecification(@RequestBody String filename, Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        String formattedYaml = this.persistenceService.retrieveYaml(filename, (String) session.getAttribute("username"));
        session.setAttribute("finalYaml", formattedYaml);
        return "reviewPage";
    }

    // Funzionalità 4 (visualizzazione logs)
    @GetMapping("/logs")
    public String logs(Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        return "logs";
    }


    // OASCreation steps (step della funzionalità 1) -------------------------------------------------------------------



    // 1.1 - definizione della informazioni generali della specifica
    @GetMapping("/specificationInfos")
    public String specificationInfos(Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        List<String> files = this.persistenceService.retrieveAllGeneralInfos((String) session.getAttribute("username"));
        model.addAttribute("generalInfoFiles", files);
        return "specificationInfos";
    }

    // 1.2 - definizione delle entità
    @GetMapping("/schemaDefinition")
    public String schemaDefinition(Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        if (Utils.isNullOrEmpty(pojoList)) {
            if (!setPojos())
                return "error";
        }
        model.addAttribute("checkboxList", pojoList);
        return "schemaDefinition";
    }

    // 1.2.x - definizione degli attributi di una entità
    @GetMapping("/pojoDefinition")
    public String showDefinizionePojoPage(@RequestParam(name = "entityName", required = true) String paramName, Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        if (paramName != null) {
            if (Utils.isNullOrEmpty(pojoMap) && !setPojos()) {
                return "error";
            }
            if (pojoMap.containsKey(paramName)) {
                String currentPojoName = "currentPojo" + paramName;
                model.addAttribute("currentPojoName", currentPojoName);

                if (session.getAttribute(currentPojoName) == null) {
                    session.setAttribute(currentPojoName, pojoMap.get(paramName));
                    model.addAttribute(currentPojoName, pojoMap.get(paramName));
                } else {
                    // il dato è già stato modificato
                    model.addAttribute(currentPojoName, session.getAttribute(currentPojoName));

                    if (session.getAttribute(currentPojoName) != pojoMap.get(paramName)) {
                        model.addAttribute("pojoEdited", true);
                    }
                }
            }
        }

        return "pojoBuilding";
    }

    // 1.3 - definizione dello schema di sicurezza
    @GetMapping("/securityScheme")
    public String securityScheme(Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        List<String> files = this.persistenceService.retrieveAllSecuritySchemes((String) session.getAttribute("username"));
        model.addAttribute("securitySchemes", files);
        return "securityScheme";
    }

    // 1.4 - definizione di tag, path e operazioni
    @GetMapping("/pathsDefinition")
    public String pathsDefinition(Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        List<String> currentPojoList = new ArrayList<>();

        List<String> selectedPojos = (List<String>) session.getAttribute("selectedPojos");

        for (String currentPojoName : Collections.list(session.getAttributeNames())) {
            if (currentPojoName.startsWith("currentPojo")) {
                String pojoName = currentPojoName.replace("currentPojo", "");
                if (selectedPojos != null && selectedPojos.contains(pojoName)) {
                    model.addAttribute(pojoName, session.getAttribute(currentPojoName));
                    currentPojoList.add(pojoName);
                }
            }
        }
        model.addAttribute("currentPojoList", currentPojoList);


        List<String> scopes = new ArrayList<>();
        OAuthFlows o = ((SecurityScheme) session.getAttribute("securityScheme")).getFlows();
        if (o.getAuthorizationCode() != null && !Utils.isNullOrEmpty(o.getAuthorizationCode().getScopes()))
            scopes.addAll(o.getAuthorizationCode().getScopes().keySet().stream().toList());

        if (o.getImplicit() != null && !Utils.isNullOrEmpty(o.getImplicit().getScopes()))
            scopes.addAll(o.getImplicit().getScopes().keySet().stream().toList());

        if (o.getPassword() != null && !Utils.isNullOrEmpty(o.getPassword().getScopes()))
            scopes.addAll(o.getPassword().getScopes().keySet().stream().toList());

        if (o.getClientCredentials() != null && !Utils.isNullOrEmpty(o.getClientCredentials().getScopes()))
            scopes.addAll(o.getClientCredentials().getScopes().keySet().stream().toList());

        model.addAttribute("securitySchemeName", "defaultsecurity");
        model.addAttribute("securitySchemeScopes", scopes.stream().distinct().collect(Collectors.toList()));
        return "pathsDefinition";
    }

    // 1.5 - pagina di review con possibilità di download/modifica e validazione .yaml e generazione server
    @GetMapping("/reviewPage")
    public String reviewPage(Model model, HttpSession session) {
        if (!loginCheck(model, session)) {
            return REDIRECT;
        }
        String finalYamlSpec = (String) session.getAttribute("finalYaml");
        if (finalYamlSpec == null) {
            List<Tag> tags = (List<Tag>) session.getAttribute("tagList");
            ApiSpec apiSpec = (ApiSpec) session.getAttribute("apiSpec");

            if (apiSpec != null) {
                apiSpec.setTags(tags);

                List<String> selectedPojos = (List<String>) session.getAttribute("selectedPojos");
                Map<String, String> map = new HashMap<>();
                for (String name: selectedPojos) {
                    String pojoValue = (String) session.getAttribute("currentPojo"+name);
                    map.put(name, pojoValue);
                }
                SecurityScheme securityScheme = session.getAttribute("securityScheme") != null ? (SecurityScheme) session.getAttribute("securityScheme") : null;
                String yamlComponents = this.entitiesService.defineYamlComponents(map, securityScheme);
                finalYamlSpec = this.yamlService.buildYaml(apiSpec, yamlComponents);

                if (session.getAttribute("securityConfig") != null) {
                    SecurityConfig cfg = (SecurityConfig) session.getAttribute("securityConfig");
                    Map<String, List<String>> scopesMap = new HashMap<>();
                    for (Tag t: tags) {
                        for (Path p: t.getPaths()) {
                            for (Operation o: p.getOperations()) {
                                String key = p.getPath() + " - " + o.getMethod().toUpperCase();
                                if (o.getSecurity() != null) {
                                    for (Security s: o.getSecurity()) {
                                        if (s.getSecuritySchemaName().equals("defaultsecurity")) {
                                            scopesMap.put(key, s.getScopes());
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    tags.get(0).getPaths().get(0).getOperations().get(0).getSecurity().get(0).getScopes();
                }
            }
            else {
                finalYamlSpec = "Error while parsing yaml file";
            }
        }
        model.addAttribute("finalYaml", finalYamlSpec);

        return "reviewPage";
    }

    // 1.5.x - validazione di un file yaml
    @PostMapping("/validateYaml")
    public ResponseEntity<String> validateYaml(@RequestBody Map<String, String> data) {

        String yamlString = data.get("yaml");
        String deamonUrl = deamonPath + validateYamlApi;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(yamlString, headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(deamonUrl, requestEntity, String.class);
            return responseEntity;
        } catch (Exception e) {
            System.out.println("Errore durante la chiamata all'endpoint: " + e.getMessage());
        };
        return ResponseEntity.ok("Error");
    }



    // Metodi di utilità -----------------------------------------------------------------------------------------------
    private boolean loginCheck(Model model, HttpSession session) {
        String username = (String) session.getAttribute("username");
        model.addAttribute("username", username);
        if (username != null) {
            model.addAttribute("username", username);
            return true;
        } else {
            return false;
        }
    }

    private boolean setPojos(){
        ResponseEntity<Map> response = this.entitiesService.retrieveAllEntities();
        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, String> map = response.getBody();
            pojoMap = map;
            pojoList = map.keySet().stream().toList();
            return true;
        }
        return false;
    }
}
