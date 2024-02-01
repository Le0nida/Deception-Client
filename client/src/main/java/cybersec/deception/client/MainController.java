package cybersec.deception.client;

import cybersec.deception.model.Path;
import cybersec.deception.model.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;
import java.util.stream.Collectors;

@Component
class DatiCondivisi {
    private Map<String, Object> dati = new HashMap<>();

    public Object getDato(String contesto) {
        return dati.get(contesto);
    }

    public void setDato(String contesto, Object dato) {
        dati.put(contesto, dato);
    }

    public Map<String, Object> getDati() { return dati; }
}

@Controller
public class MainController {
    @Autowired
    private ApplicationContext applicationContext;

    private static List<String> pojoList;
    private static Map<String, String> pojoMap;

    @GetMapping("/")
    public String homePage(Model model) {

        // TODO
        // chiamata al demone per ottenere un JSON con tutte le entità
        // uesto JSON va poi diviso in entità padre e passata una per una al modello
        // model.addAttribute("entities", jsonString);
        List<String> list = Arrays.asList("User", "Option2", "Option3");

        String userString = "{\n" +
                "  \"userId\": 123456,\n" +
                "  \"username\": \"john_doe\",\n" +
                "  \"password\": \"securepassword\",\n" +
                "  \"firstName\": \"John\",\n" +
                "  \"lastName\": \"Doe\",\n" +
                "  \"gender\": \"male\",\n" +
                "  \"email\": \"john.doe@example.com\",\n" +
                "  \"ipAddress\": \"192.168.1.100\",\n" +
                "  \"address\": {\n" +
                "    \"street\": \"123 Main Street\",\n" +
                "    \"city\": \"Anytown\",\n" +
                "    \"state\": \"CA\",\n" +
                "    \"indirizzo\": {\n" +
                "      \"prova\": \"123 Main Street\"\n" +
                "    },\n" +
                "    \"zipCode\": \"12345\",\n" +
                "    \"country\": \"USA\"\n" +
                "  },\n" +
                "  \"age\": 30,\n" +
                "  \"isActive\": true\n" +
                "}";

        String fakeString = "{\n" +
                "  \"fakeId\": 123456,\n" +
                "  \"fakename\": \"john_doe\",\n" +
                "  \"fakepwd\": \"securepassword\",\n" +
                "  \"fakeName\": \"John\"\n" +
                "}";

        Map<String, String> map = new HashMap<>();
        map.put("User", userString);
        map.put("Option2", fakeString);
        map.put("Option3", fakeString);

        pojoMap = map;
        pojoList = list;
        return "index";
    }

    @GetMapping("/creazioneSpecifica")
    public String showSpecCreationPage(@RequestParam(name = "step", required = false) String step, Model model) {

        if (step.equals("pojo")) {
            if (pojoList != null && !pojoList.isEmpty()) {
                model.addAttribute("checkboxList", pojoList);
                return "schemaDefinition";
            } else {
                model.addAttribute("currentError", "Non è stato possibile recuperare le informazioni JSON");
                return "errorpage";
            }
        } else if (step.equals("paths")) {
            DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
            if (datiCondivisi.getDati().keySet() != null && datiCondivisi.getDati().keySet().stream()
                    .filter(key -> key.startsWith("currentPojo"))
                    .collect(Collectors.toSet()).size() > 0) {

                // TODO prendere solo i dati non anche le chaivi dei nomi
                for (String currentPojoName : datiCondivisi.getDati().keySet().stream()
                        .filter(key -> key.startsWith("currentPojo"))
                        .collect(Collectors.toSet())) {
                    model.addAttribute(currentPojoName, datiCondivisi.getDato(currentPojoName));
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

    @GetMapping("/reviewPage")
    public String reviewPage(Model model) {

        DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
        model.addAttribute("jsonFinale", datiCondivisi.getDato("tagList"));

        return "reviewPage";
    }

    @PostMapping("/reviewSpec")
    public ResponseEntity<String> tagKeyDescMap(@RequestBody List<Tag> data) {
        DatiCondivisi datiCondivisi = applicationContext.getBean(DatiCondivisi.class);
        datiCondivisi.setDato("tagList", data);
        return ResponseEntity.ok("reviewPage");
    }
}
