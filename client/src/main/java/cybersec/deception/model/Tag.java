package cybersec.deception.model;

import java.util.List;
import java.util.Map;

public class Tag {

    private String name;
    private String description;
    private List<Path> paths;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Path> getPaths() {
        return paths;
    }

    public void setPaths(List<Path> paths) {
        this.paths = paths;
    }

    @Override
    public String toString() {
        return "Tag{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", paths=" + paths +
                '}';
    }

    public Object toMap() {
        return Map.of("name", name, "description", description);
    }
}
