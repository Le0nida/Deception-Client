package cybersec.deception.model;

import java.util.List;

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
}
