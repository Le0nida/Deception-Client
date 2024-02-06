package cybersec.deception.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cybersec.deception.client.config.JwtTokenUtil;
import cybersec.deception.client.services.EntitiesService;
import cybersec.deception.client.utils.DatiCondivisi;
import cybersec.deception.model.*;
import cybersec.deception.client.services.YamlBuilderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Controller
public class MainController {

    @Autowired
    private ApplicationContext applicationContext;

    private final YamlBuilderService yamlService;
    private final EntitiesService entitiesService;
    private final JwtTokenUtil jwtTokenUtil;
    private static List<String> pojoList;
    private static Map<String, String> pojoMap;

    @Autowired
    public MainController(YamlBuilderService yamlService, EntitiesService entitiesService, JwtTokenUtil jwtTokenUtil) {
        this.yamlService = yamlService;
        this.entitiesService = entitiesService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @GetMapping("/")
    public String homePage(Model model) {

        // all'avvio resetto tutto
        DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
        datiCondivisi.clear();

        ResponseEntity<Map> response = this.entitiesService.retrieveAllEntities();

        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, String> map = response.getBody();
            pojoMap = map;
            pojoList = map.keySet().stream().toList();
            return "index";
        } else {
            return "error";
        }
    }

    @PostMapping("/")
    public String homePagePost(Model model) {

        // Nel punto del codice in cui desideri ottenere lo username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = "";
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            username = ((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal()).getUsername();
            System.out.println("Username: " + username);
        } else {
            System.out.println("Utente non autenticato o informazioni non disponibili.");
        }

        // generazione token (login effettuato)
        String token = jwtTokenUtil.generateToken(username);
        model.addAttribute("securityToken", token);

        // all'avvio resetto tutto
        DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
        datiCondivisi.clear();

        ResponseEntity<Map> response = this.entitiesService.retrieveAllEntities();

        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, String> map = response.getBody();
            pojoMap = map;
            pojoList = map.keySet().stream().toList();
            return "index";
        } else {
            return "error";
        }
    }


    @GetMapping("/schemaDefinition")
    public String schemaDefinition(Model model) {
        model.addAttribute("checkboxList", pojoList);
        return "schemaDefinition";
    }

    @GetMapping("/specificationInfos")
    public String specificationInfos(Model model) {
        return "specificationInfos";
    }

    @GetMapping("/pathsDefinition")
    public String pathsDefinition(Model model) {
        DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
        List<String> currentPojoList = new ArrayList<>();
        for (String currentPojoName : datiCondivisi.getDati().keySet().stream()
                .filter(key -> key.startsWith("currentPojo"))
                .collect(Collectors.toSet())) {

            String pojoName = currentPojoName.replace("currentPojo", "");
            if (((List<String>) datiCondivisi.getDato("selectedPojos")).contains(pojoName)){
                model.addAttribute(pojoName, datiCondivisi.getDato(currentPojoName));
                currentPojoList.add(pojoName);
            }
        }
        model.addAttribute("currentPojoList", currentPojoList);
        return "pathsDefinition";
    }

    @PostMapping("/creazioneSpecifica")
    public String showSpecCreationPage(@RequestBody Map<String, Object> requestBody, Model model) {
        String step = (String) requestBody.get("step");

        if (step.equals("general")) {
            if (pojoList != null && !pojoList.isEmpty()) {
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

                System.out.println(apiSpec.toString());

                DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
                datiCondivisi.setDato("apiSpec", apiSpec);

                return "schemaDefinition";
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare le informazioni JSON");
                return "errorpage";
            }
        } else if (step.equals("paths")) {
            List<String> pojos = (List<String>) requestBody.get("pojos");
            System.out.println(pojos);


            DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
            datiCondivisi.setDato("selectedPojos", pojos);
            if (datiCondivisi.getDati().keySet() != null && datiCondivisi.getDati().keySet().stream()
                    .filter(key -> key.startsWith("currentPojo"))
                    .collect(Collectors.toSet()).size() > 0) {

                return "pathsDefinition";
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare lo schema definito");
                return "errorpage";
            }
        } else {
            return "errorpage";
        }
    }

    @GetMapping("/definizionePojo")
    public String showDefinizionePojoPage(@RequestParam(name = "entityName", required = true) String paramName, Model model) {
        if (paramName != null) {
            DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
            if (pojoMap.containsKey(paramName)) {
                String currentPojoName = "currentPojo" + paramName;
                model.addAttribute("currentPojoName", currentPojoName);

                if (datiCondivisi.getDato(currentPojoName) == null) {
                    datiCondivisi.setDato(currentPojoName, pojoMap.get(paramName));
                    model.addAttribute(currentPojoName, pojoMap.get(paramName));
                } else {
                    // il dato è già stato modificato
                    model.addAttribute(currentPojoName, datiCondivisi.getDato(currentPojoName));

                    if (datiCondivisi.getDato(currentPojoName) != pojoMap.get(paramName)) {
                        model.addAttribute("pojoEdited", true);
                    }
                }
            }
        }

        return "pojoBuilding";
    }

    @PostMapping("/aggiornaModello")
    public ResponseEntity<String> aggiornaModello(@RequestBody Map<String, String> data) {
        // Ottieni il valore dal corpo della richiesta
        String valoreDaAggiornare = data.get("valoreDaAggiornare");
        String attributoDaAggiornare = data.get("attributoDaAggiornare");

        DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);

        datiCondivisi.setDato(attributoDaAggiornare, valoreDaAggiornare);
        return ResponseEntity.ok("Modello aggiornato con successo");
    }

    @PostMapping("/validazioneYaml")
    public ResponseEntity<String> validazioneYaml(@RequestBody Map<String, String> data) {

        String yaml = data.get("yaml");

        // TODO

        String otherProjectUrl = "http://localhost:8080/api/validateOpenAPISpec"; // Cambia l'URL con quello effettivo dell'altro progetto
        RestTemplate restTemplate = new RestTemplate();

        // Esegui la chiamata HTTP per ottenere la mappa di contenuti
        return null; //restTemplate.getForEntity(otherProjectUrl, String.class);
    }

    @GetMapping("/reviewPage")
    public String reviewPage(Model model) {

        DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
        List<Tag> tags = (List<Tag>) datiCondivisi.getDato("tagList");
        ApiSpec apiSpec = (ApiSpec) datiCondivisi.getDato("apiSpec");
        apiSpec.setTags(tags);

        List<String> selectedPojos = (List<String>) datiCondivisi.getDato("selectedPojos");
        Map<String, String> map = new HashMap<>();
        for (String name: selectedPojos) {
            String pojoValue = (String) datiCondivisi.getDato("currentPojo"+name);
            map.put(name, pojoValue);
        }
        String yamlComponents = this.entitiesService.defineYamlComponents(map);
        String finalYamlSpec = this.yamlService.buildYaml(apiSpec, yamlComponents);

        model.addAttribute("finalYaml", finalYamlSpec);

        return "reviewPage";
    }

    // Metodo per convertire una lista di oggetti in YAML

    @PostMapping("/reviewSpec")
    public ResponseEntity<String> tagKeyDescMap(@RequestBody List<Tag> data) {
        DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
        datiCondivisi.setDato("tagList", data);
        return ResponseEntity.ok("reviewPage");
    }
}
