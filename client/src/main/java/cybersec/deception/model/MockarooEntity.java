package cybersec.deception.model;

import org.json.JSONArray;

import java.util.List;



public class MockarooEntity {
    private String name;
    private List<MockarooField> fields;

    public MockarooEntity(String name, List<MockarooField> fields) {
        this.name = name;
        this.fields = fields;
    }

    public JSONArray fieldsToJson() {
        JSONArray jsonArray = new JSONArray();
        for (MockarooField field : fields) {
            jsonArray.put(field.toJson());
        }
        return jsonArray;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<MockarooField> getFields() {
        return fields;
    }

    public void setFields(List<MockarooField> fields) {
        this.fields = fields;
    }
}
