package cybersec.deception.model;

import java.util.List;

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
}
