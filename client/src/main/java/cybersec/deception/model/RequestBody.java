package cybersec.deception.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RequestBody {

    private String description;
    private Content content;
    private boolean required;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    @Override
    public String toString() {
        return "RequestBody{" +
                "description='" + description + '\'' +
                ", content=" + content +
                ", required=" + required +
                '}';
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("description", description);
        map.put("content", content != null ? content.toMap() : null);
        map.put("required", required);
        return map;
    }
}
