package cybersec.deception.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cybersec.deception.client.services.EntitiesService;
import cybersec.deception.client.services.PersistenceService;
import cybersec.deception.client.utils.Utils;
import cybersec.deception.model.*;
import cybersec.deception.client.services.YamlBuilderService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Controller
public class MainController {

    private final YamlBuilderService yamlService;
    private final EntitiesService entitiesService;
    private final PersistenceService persistenceService;
    private static List<String> pojoList;
    private static Map<String, String> pojoMap;

    @Autowired
    public MainController(YamlBuilderService yamlService, EntitiesService entitiesService, PersistenceService persistenceService) {
        this.yamlService = yamlService;
        this.entitiesService = entitiesService;
        this.persistenceService = persistenceService;
    }

    private String loginCheck(Model model, HttpSession session, String pageToReturn) {
        String username = (String) session.getAttribute("username");
        model.addAttribute("username", username);
        if (username != null) {
            model.addAttribute("username", username);
            return pageToReturn;
        } else {
            return "redirect:/login";
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

    @GetMapping("/")
    public String homePage(Model model, HttpSession session) {
        String returnPage = loginCheck(model, session, "index");

        List<String> files = this.persistenceService.retrieveAllYaml((String) session.getAttribute("username"));
        model.addAttribute("yamlFiles", files);

        boolean boolPojo = setPojos();
        return boolPojo ? returnPage : "error";
    }

    @GetMapping("/schemaDefinition")
    public String schemaDefinition(Model model, HttpSession session) {
        if (Utils.isNullOrEmpty(pojoList)) {
            if (!setPojos())
                return "error";
        }
        model.addAttribute("checkboxList", pojoList);
        return loginCheck(model, session, "schemaDefinition");
    }

    @GetMapping("/specificationInfos")
    public String specificationInfos(Model model, HttpSession session) {
        List<String> files = this.persistenceService.retrieveAllGeneralInfos((String) session.getAttribute("username"));
        model.addAttribute("generalInfoFiles", files);
        return loginCheck(model, session, "specificationInfos");
    }

    @GetMapping("/pathsDefinition")
    public String pathsDefinition(Model model, HttpSession session) {
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
        return loginCheck(model, session, "pathsDefinition");
    }

    @PostMapping("/creazioneSpecifica")
    public String showSpecCreationPage(@RequestBody Map<String, Object> requestBody, Model model, HttpSession session) {
        String step = (String) requestBody.get("step");

        if (step.equals("general")) {
            if (!Utils.isNullOrEmpty(pojoList) || setPojos()) {
                return loginCheck(model, session, "specificationInfos");
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
                return loginCheck(model, session, "schemaDefinition");
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare le informazioni JSON");
                return "errorpage";
            }
        } else if (step.equals("paths")) {
            List<String> pojos = (List<String>) requestBody.get("pojos");

            session.setAttribute("selectedPojos", pojos);
            if (Collections.list(session.getAttributeNames()).stream().anyMatch(name -> name.startsWith("currentPojo"))) {
                return loginCheck(model, session, "pathsDefinition");
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare lo schema definito");
                return "errorpage";
            }
        } else {
            return "errorpage";
        }
    }

    @GetMapping("/definizionePojo")
    public String showDefinizionePojoPage(@RequestParam(name = "entityName", required = true) String paramName, Model model, HttpSession session) {
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

        return loginCheck(model, session, "pojoBuilding");
    }

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

    @PostMapping("/aggiornaModello")
    public ResponseEntity<String> aggiornaModello(@RequestBody Map<String, String> data, HttpSession session) {
        // Ottieni il valore dal corpo della richiesta
        String valoreDaAggiornare = data.get("valoreDaAggiornare");
        String attributoDaAggiornare = data.get("attributoDaAggiornare");
        session.setAttribute(attributoDaAggiornare, valoreDaAggiornare);
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
    public String reviewPage(Model model, HttpSession session) {

        String finalYamlSpec = (String) session.getAttribute("finalYaml");
        if (finalYamlSpec == null) {
            List<Tag> tags = (List<Tag>) session.getAttribute("tagList");
            ApiSpec apiSpec = (ApiSpec) session.getAttribute("apiSpec");
            apiSpec.setTags(tags);

            List<String> selectedPojos = (List<String>) session.getAttribute("selectedPojos");
            Map<String, String> map = new HashMap<>();
            for (String name: selectedPojos) {
                String pojoValue = (String) session.getAttribute("currentPojo"+name);
                map.put(name, pojoValue);
            }
            String yamlComponents = this.entitiesService.defineYamlComponents(map);
            finalYamlSpec = this.yamlService.buildYaml(apiSpec, yamlComponents);
        }
        model.addAttribute("finalYaml", finalYamlSpec);

        return loginCheck(model, session, "reviewPage");
    }

    // Metodo per convertire una lista di oggetti in YAML

    @PostMapping("/reviewSpec")
    public ResponseEntity<String> tagKeyDescMap(@RequestBody List<Tag> data, HttpSession session) {
        session.setAttribute("tagList", data);
        return ResponseEntity.ok("reviewPage");
    }

    @PostMapping("/importSchema")
    public ResponseEntity<String> importSchema(@RequestBody String yaml, HttpSession session) {
        String formattedYaml = this.yamlService.formatYaml(yaml);
        session.setAttribute("finalYaml", formattedYaml);
        return ResponseEntity.ok("reviewPage");
    }

    @PostMapping("/selectSchema")
    public ResponseEntity<String> selectSchema(@RequestBody String filename, HttpSession session) {
        String formattedYaml = this.persistenceService.retrieveYaml(filename, (String) session.getAttribute("username"));
        session.setAttribute("finalYaml", formattedYaml);
        return ResponseEntity.ok("reviewPage");
    }

    @PostMapping("/saveSpecification")
    public ResponseEntity<String> uploadYamlFile(@RequestBody Map<String, String> data, HttpSession session) {
        String filename = data.get("filename");
        String yaml = data.get("yaml");
        String response = this.persistenceService.uploadYaml(yaml, filename, (String) session.getAttribute("username"));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/getGeneralInfos")
    public ResponseEntity<String> getGeneralInfos(@RequestBody String filename, HttpSession session) {
        String generalInfo = this.persistenceService.retrieveGeneralInfo(filename, (String) session.getAttribute("username"));
        // session.setAttribute("generalInfo", generalInfo);
        return ResponseEntity.ok(generalInfo);
    }

    @PostMapping("/setGeneralInfos")
    public ResponseEntity<String> setGeneralInfos(@RequestBody Map<String, String> data, HttpSession session) {
        String filename = data.get("filename");
        String generalInfo = data.get("generalInfo");
        String response = this.persistenceService.uploadGeneralInfo(generalInfo, filename, (String) session.getAttribute("username"));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generateImgFromZip")
    public String generateImgFromZip(@RequestParam("file") MultipartFile file) {
        // Controlla se il file è stato fornito
        if (file.isEmpty()) {
            return "Errore: nessun file fornito.";
        }

        // TODO

        try {
            // Esempio di salvataggio del file .zip nel server
            byte[] bytes = file.getBytes();
            // Qui esegui la logica per generare l'immagine docker dal file .zip

            // Ritorna il percorso dell'immagine docker generata
            return "/path/to/generated/docker/image";
        } catch (IOException e) {
            e.printStackTrace();
            return "Errore durante il caricamento del file: " + e.getMessage();
        }
    }
}
