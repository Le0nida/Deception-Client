package cybersec.deception.client.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class GeoLocationController {

    @Value("${ip2location.api.key}")
    private String apiKey;

    @SuppressWarnings("FieldCanBeLocal")
    private final String ip2LocationApiUrl = "https://api.ip2location.io/";

    @GetMapping("/api/getGeoLocation")
    public ResponseEntity<?> getGeoLocation(@RequestParam String ip) {
        String url = ip2LocationApiUrl + "?key=" + apiKey + "&ip=" + ip + "&format=json";

        RestTemplate restTemplate = new RestTemplate();
        try {
            GeoLocationResponse response = restTemplate.getForObject(url, GeoLocationResponse.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch geolocation data");
        }
    }
}
