package cybersec.deception.model;

import java.util.List;

public class ApiSpec {

    private String openapi;
    private Info info;
    private ExternalDocs externalDocs;
    private List<Server> servers;
    private List<Tag> tags;

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public String getOpenapi() {
        return openapi;
    }

    public void setOpenapi(String openapi) {
        this.openapi = openapi;
    }

    public Info getInfo() {
        return info;
    }

    public void setInfo(Info info) {
        this.info = info;
    }

    public ExternalDocs getExternalDocs() {
        return externalDocs;
    }

    public void setExternalDocs(ExternalDocs externalDocs) {
        this.externalDocs = externalDocs;
    }

    public List<Server> getServers() {
        return servers;
    }

    public void setServers(List<Server> servers) {
        this.servers = servers;
    }

    @Override
    public String toString() {
        return "ApiSpec{" +
                "openapi='" + openapi + '\'' +
                ", info=" + info +
                ", externalDocs=" + externalDocs +
                ", servers=" + servers +
                ", tags=" + tags +
                '}';
    }
}

