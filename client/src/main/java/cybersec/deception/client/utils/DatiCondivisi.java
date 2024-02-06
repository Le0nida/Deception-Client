package cybersec.deception.client.utils;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class DatiCondivisi {
    private Map<String, Object> dati = new HashMap<>();

    public Object getDato(String contesto) {
        return dati.get(contesto);
    }

    public void setDato(String contesto, Object dato) {
        dati.put(contesto, dato);
    }

    public Map<String, Object> getDati() {
        return dati;
    }

    public void clear() {
        dati.clear();
    }
}
