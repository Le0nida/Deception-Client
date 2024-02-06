package cybersec.deception.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Operation {

    private String id;
    private List<String> tags;
    private String method;
    private String description;
    private String summary;
    private List<Parameter> parameters;
    private RequestBody requestBody;
    private List<Response> responses;
    private List<String> security;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<Parameter> getParameters() {
        return parameters;
    }

    public void setParameters(List<Parameter> parameters) {
        this.parameters = parameters;
    }

    public RequestBody getRequestBody() {
        return requestBody;
    }

    public void setRequestBody(RequestBody requestBody) {
        this.requestBody = requestBody;
    }

    public List<Response> getResponses() {
        return responses;
    }

    public void setResponses(List<Response> responses) {
        this.responses = responses;
    }

    public List<String> getSecurity() {
        return security;
    }

    public void setSecurity(List<String> security) {
        this.security = security;
    }

    @Override
    public String toString() {
        return "Operation{" +
                "id='" + id + '\'' +
                ", tags=" + tags +
                ", method='" + method + '\'' +
                ", description='" + description + '\'' +
                ", summary='" + summary + '\'' +
                ", parameters=" + parameters +
                ", requestBody=" + requestBody +
                ", responses=" + responses +
                ", security=" + security +
                '}';
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("tags", tags);
        map.put("method", method);
        map.put("description", description);
        map.put("summary", summary);
        map.put("parameters", parameters);
        map.put("requestBody", requestBody);
        map.put("responses", responses);
        map.put("security", security);
        return map;
    }
}
