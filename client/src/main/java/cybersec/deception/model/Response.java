package cybersec.deception.model;

import java.util.List;

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
}
