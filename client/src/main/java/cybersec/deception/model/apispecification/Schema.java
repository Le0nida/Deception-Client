package cybersec.deception.model.apispecification;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Schema {

    private String type;
    private String format;
    private String reference;
    private List<String> items;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "Schema{" +
                "type='" + type + '\'' +
                ", format='" + format + '\'' +
                ", reference='" + reference + '\'' +
                ", items=" + items +
                '}';
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("type", type);
        map.put("format", format);
        map.put("reference", reference);
        map.put("items", items);
        return map;
    }
}
