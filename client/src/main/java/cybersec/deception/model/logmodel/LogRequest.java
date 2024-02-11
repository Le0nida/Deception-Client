package cybersec.deception.model.logmodel;

public class LogRequest {

    private String token;

    private HttpRequestLog filter;

    public String getToken() {
        return token;
    }

    public HttpRequestLog getFilter() {
        return filter;
    }
}
