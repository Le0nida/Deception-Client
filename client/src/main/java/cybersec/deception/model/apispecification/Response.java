package cybersec.deception.model.apispecification;

import java.util.HashMap;
import java.util.Map;

public class Response {

    private String statusCode;
    private String description;
    private Content content;

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

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

    @Override
    public String toString() {
        return "Response{" +
                "statusCode='" + statusCode + '\'' +
                ", description='" + description + '\'' +
                ", content=" + content +
                '}';
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("statusCode", statusCode);
        map.put("description", description);
        map.put("content", content != null ? content.toMap() : null);
        return map;
    }
}
