package cybersec.deception.model.apispecification;

import java.util.HashMap;
import java.util.Map;

public class Parameter {

    private String name;
    private String intype;
    private String description;
    private boolean required;
    private boolean allowEmptyValue;
    private Schema schema;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIntype() {
        return intype;
    }

    public void setIntype(String intype) {
        this.intype = intype;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public boolean isAllowEmptyValue() {
        return allowEmptyValue;
    }

    public void setAllowEmptyValue(boolean allowEmptyValue) {
        this.allowEmptyValue = allowEmptyValue;
    }

    public Schema getSchema() {
        return schema;
    }

    public void setSchema(Schema schema) {
        this.schema = schema;
    }

    @Override
    public String toString() {
        return "Parameter{" +
                "name='" + name + '\'' +
                ", intype='" + intype + '\'' +
                ", description='" + description + '\'' +
                ", required=" + required +
                ", allowEmptyValue=" + allowEmptyValue +
                ", schema=" + schema +
                '}';
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("intype", intype);
        map.put("description", description);
        map.put("required", required);
        map.put("allowEmptyValue", allowEmptyValue);
        map.put("schema", schema != null ? schema.toMap() : null);
        return map;
    }
}
