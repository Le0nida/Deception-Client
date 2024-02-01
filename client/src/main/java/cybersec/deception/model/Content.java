package cybersec.deception.model;

import java.util.List;

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
}
