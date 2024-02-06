package cybersec.deception.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Content {
    private String type;
    private Schema schema;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Schema getSchema() {
        return schema;
    }

    public void setSchema(Schema schema) {
        this.schema = schema;
    }

    @Override
    public String toString() {
        return "Content{" +
                "type='" + type + '\'' +
                ", schema=" + schema +
                '}';
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("type", type);
        map.put("schema", schema != null ? schema.toMap() : null);
        return map;
    }
}
