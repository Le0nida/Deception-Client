package cybersec.deception.model.logmodel;


import com.fasterxml.jackson.annotation.JsonProperty;

public class HttpRequestLog {

    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("httpMethod")
    private String httpMethod;

    @JsonProperty("requestURL")
    private String requestURL;

    @JsonProperty("headers_host")
    private String headers_host;

    @JsonProperty("headers_useragent")
    private String headers_useragent;

    @JsonProperty("headers_contenttype")
    private String headers_contenttype;

    @JsonProperty("headers_acccept")
    private String headers_acccept;

    @JsonProperty("headers_authorization")
    private String headers_authorization;

    @JsonProperty("queryParameters")
    private String queryParameters;

    @JsonProperty("requestBody")
    private String requestBody;

    @JsonProperty("clientIPAddress")
    private String clientIPAddress;

    @JsonProperty("clientPort")
    private int clientPort;

    @JsonProperty("protocol")
    private String protocol;

    @JsonProperty("authenticationType")
    private String authenticationType;

    @JsonProperty("acceptedContentTypes")
    private String acceptedContentTypes;

    @JsonProperty("preferredLanguage")
    private String preferredLanguage;

    @JsonProperty("acceptedCompressionTypes")
    private String acceptedCompressionTypes;

    @JsonProperty("acceptedConnectionTypes")
    private String acceptedConnectionTypes;

    @JsonProperty("cookies")
    private String cookies;

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
