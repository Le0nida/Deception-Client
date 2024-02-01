package cybersec.deception.model;

import java.util.List;

public class ApiSpec {
    private List<Tag> tags;

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    @Override
    public String toString() {
        return "ApiSpec{" +
                "tags=" + tags +
                '}';
    }
}
