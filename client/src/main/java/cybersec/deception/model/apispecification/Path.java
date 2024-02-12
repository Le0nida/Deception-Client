package cybersec.deception.model.apispecification;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Path {

    private String path;

    private List<Operation> operations;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<Operation> getOperations() {
        return operations;
    }

    public void setOperations(List<Operation> operations) {
        this.operations = operations;
    }

    @Override
    public String toString() {
        return "Path{" +
                "path='" + path + '\'' +
                ", operations=" + operations +
                '}';
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("path", this.path);
        map.put("operations", this.operations);

        return map;
    }

}
