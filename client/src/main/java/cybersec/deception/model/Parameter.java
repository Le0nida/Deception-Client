package cybersec.deception.model;

public class Parameter {

    private String name;
    private String inType;
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

    public String getinType() {
        return inType;
    }

    public void setinType(String inType) {
        this.inType = inType;
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
                ", inType='" + inType + '\'' +
                ", description='" + description + '\'' +
                ", required=" + required +
                ", allowEmptyValue=" + allowEmptyValue +
                ", schema=" + schema +
                '}';
    }
}
