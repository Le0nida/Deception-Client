package cybersec.deception.model;

import org.json.JSONObject;

public class MockarooField {
    String name;
    String type;

    public MockarooField(String name, String type) {
        this.name = name;
        this.type = type;
    }

    public JSONObject toJson() {
        JSONObject json = new JSONObject();
        json.put("name", name);
        json.put("type", type);
        return json;
    }
}
