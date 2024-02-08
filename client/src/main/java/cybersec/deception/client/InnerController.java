package cybersec.deception.client;

import cybersec.deception.client.services.PersistenceService;
import cybersec.deception.client.services.YamlBuilderService;
import cybersec.deception.model.Tag;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.util.Enumeration;
import java.util.List;
import java.util.Map;

@Controller
public class InnerController {

    private final PersistenceService persistenceService;
    @Autowired
    public InnerController(PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
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
}
