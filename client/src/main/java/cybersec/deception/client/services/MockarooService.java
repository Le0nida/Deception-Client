package cybersec.deception.client.services;

import cybersec.deception.model.MockarooEntity;
import cybersec.deception.model.MockarooField;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Service
public class MockarooService {
    public List<MockarooEntity> parseEntities(String json) {
        JSONArray jsonArray = new JSONArray(json);
        List<MockarooEntity> entities = new ArrayList<>();

        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = jsonArray.getJSONObject(i);
            String name = jsonObject.getString("name");
            JSONArray fieldsJson = jsonObject.getJSONArray("fields");

            List<MockarooField> fields = new ArrayList<>();
            for (int j = 0; j < fieldsJson.length(); j++) {
                JSONObject fieldJson = fieldsJson.getJSONObject(j);
                String fieldName = fieldJson.getString("name");
                String fieldType = fieldJson.getString("type");
                fields.add(new MockarooField(fieldName, fieldType));
            }

            entities.add(new MockarooEntity(name, fields));
        }

        return entities;
    }

    public HttpRequest buildRequest(JSONArray schema) throws Exception {
        return HttpRequest.newBuilder()
                .uri(new URI("https://api.mockaroo.com/api/generate.json?key=b324d530&array=true&count=1"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(schema.toString()))
                .build();
    }

    public String generateData(HttpRequest request) throws Exception {

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return response.body().substring(1, response.body().length()-1).replace("{","{\n  ")
                    .replace("}","\n}").replace(",\"", ",\n  \"");
        } else {
            return null;
        }
    }
}
