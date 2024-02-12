package cybersec.deception.client.services;

import cybersec.deception.client.utils.Utils;
import cybersec.deception.model.apispecification.*;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;

import java.util.List;
import java.util.Map;

@Service
public class YamlBuilderService {

    // I campi che non hanno il controllo null è perchè sono obbligatori

    private String transformYamlPaths(Path pathObject) {
        StringBuilder transformedYaml = new StringBuilder();
        transformedYaml.append("  ").append(pathObject.getPath()).append(":\n");

        for (Operation operation: pathObject.getOperations()) {
            String operationId = operation.getId();
            String summary = operation.getSummary();
            String description = operation.getDescription();
            String method = operation.getMethod();

            transformedYaml.append("    ").append(method.toLowerCase()).append(":\n");
            transformedYaml.append("      tags:").append("\n");
            for (String tag: operation.getTags()) {
                transformedYaml.append("        - ").append(tag.toLowerCase()).append("\n");
            }
            transformedYaml.append("      operationId: ").append(operationId).append("\n");
            if (!Utils.isNullOrEmpty(description)) {
                transformedYaml.append("      description: ").append(description).append("\n");
            }
            if (!Utils.isNullOrEmpty(summary)) {
                transformedYaml.append("      summary: ").append(summary).append("\n");
            }

            // Handle parameters
            if (!Utils.isNullOrEmpty(operation.getParameters())) {
                transformedYaml.append("      parameters:\n");
                for (Parameter parameter : operation.getParameters()) {
                    transformedYaml.append("        - name: ").append(parameter.getName()).append("\n");
                    transformedYaml.append("          in: ").append(parameter.getIntype()).append("\n");
                    if (!Utils.isNullOrEmpty(parameter.getDescription())) {
                        transformedYaml.append("          description: ").append(parameter.getDescription()).append("\n");
                    }
                    if (!("" + parameter.isRequired()).equals("false") || !("" + parameter.isRequired()).equals("true")) {
                        transformedYaml.append("          required: ").append(parameter.isRequired()).append("\n");
                    }
                    if (!("" + parameter.isAllowEmptyValue()).equals("false") || !("" + parameter.isAllowEmptyValue()).equals("true")) {
                        transformedYaml.append("          allowEmptyValue: ").append(parameter.isAllowEmptyValue()).append("\n");
                    }

                    // Handle schema
                    Schema schema = parameter.getSchema();
                    if (schema != null && (!Utils.isNullOrEmpty(schema.getType()) || !Utils.isNullOrEmpty(schema.getFormat()) || !Utils.isNullOrEmpty(schema.getReference()))) {
                        transformedYaml.append("          schema:\n");
                        if (!Utils.isNullOrEmpty(schema.getType())) {
                            transformedYaml.append("            type: ").append(schema.getType()).append("\n");
                        }
                        if (!Utils.isNullOrEmpty(schema.getFormat())) {
                            transformedYaml.append("            format: ").append(schema.getFormat()).append("\n");
                        }
                        if (!Utils.isNullOrEmpty(schema.getReference())) {
                            transformedYaml.append("            $ref: '").append(schema.getReference()).append("'\n");
                        }
                    }
                }
            }


            // Handle requestBody
            RequestBody requestBody = operation.getRequestBody();
            if (requestBody != null) {
                transformedYaml.append("      requestBody:\n");
                if (!("" + requestBody.isRequired()).equals("false") || !("" + requestBody.isRequired()).equals("true")) {
                    transformedYaml.append("        required: ").append(requestBody.isRequired()).append("\n");
                }
                if (!Utils.isNullOrEmpty(requestBody.getDescription())) {
                    transformedYaml.append("        description: ").append(requestBody.getDescription()).append("\n");
                }

                // Handle content
                Content content = requestBody.getContent();
                if (content != null && content.getSchema() != null && (!Utils.isNullOrEmpty(content.getSchema().getType()) || !Utils.isNullOrEmpty(content.getSchema().getFormat()) || !Utils.isNullOrEmpty(content.getSchema().getReference()))) {
                    transformedYaml.append("        content:\n");

                    // il type di requestbody è application/json
                    transformedYaml.append("          ").append(content.getType()).append(":\n");

                    Schema schema = content.getSchema();
                    // Handle schema
                    transformedYaml.append("            schema:\n");
                    if (!Utils.isNullOrEmpty(schema.getType())) {
                        transformedYaml.append("              type: ").append(schema.getType()).append("\n");
                    }
                    if (!Utils.isNullOrEmpty(schema.getFormat())) {
                        transformedYaml.append("              format: ").append(schema.getFormat()).append("\n");
                    }
                    if (!Utils.isNullOrEmpty(schema.getReference())) {
                        transformedYaml.append("              $ref: '").append(schema.getReference()).append("'\n");
                    }
                }
            }

            // Handle responses
            if (!Utils.isNullOrEmpty(operation.getResponses())) {
                List<Response> responses = operation.getResponses();
                transformedYaml.append("      responses:\n");
                for (Response response : responses) {
                    String statusCode = response.getStatusCode();

                    transformedYaml.append("        '").append(statusCode).append("':\n");
                    transformedYaml.append("          description: ").append(response.getDescription()).append("\n");

                    // Handle content
                    Content content = response.getContent();
                    if (content != null && content.getSchema() != null && (!Utils.isNullOrEmpty(content.getSchema().getType()) || !Utils.isNullOrEmpty(content.getSchema().getFormat()) || !Utils.isNullOrEmpty(content.getSchema().getReference()))) {
                        transformedYaml.append("          content:\n");

                        // il type di response è application/json
                        transformedYaml.append("            ").append(content.getType()).append(":\n");

                        Schema schema = content.getSchema();
                        // Handle schema
                        transformedYaml.append("              schema:\n");
                        if (!Utils.isNullOrEmpty(schema.getType())) {
                            transformedYaml.append("                type: ").append(schema.getType()).append("\n");
                        }
                        if (!Utils.isNullOrEmpty(schema.getFormat())) {
                            transformedYaml.append("                format: ").append(schema.getFormat()).append("\n");
                        }
                        if (!Utils.isNullOrEmpty(schema.getReference())) {
                            transformedYaml.append("                $ref: '").append(schema.getReference()).append("'\n");
                        }


                        // TODO items
                    }
                }
            }

            // Handle security
            if (!Utils.isNullOrEmpty(operation.getSecurity())) {
                transformedYaml.append("      security:\n");
                for (Security sec: operation.getSecurity()) {
                    if (sec.getSecuritySchemaName().equals("optional")) {
                        transformedYaml.append("        - {}\n");
                    }
                    else {
                        transformedYaml.append("        - ").append(sec.getSecuritySchemaName()).append(":\n");
                        for (String scope: sec.getScopes()) {
                            transformedYaml.append("            - ").append(scope).append("\n");
                        }
                    }
                }
            }
        }

        return transformedYaml.toString();
    }

    private String transformYamlTags(List<Tag> tags) {
        StringBuilder transformedYaml = new StringBuilder();
        for(Tag t: tags){
            transformedYaml.append("  - name: ").append(t.getName()).append("\n");
            if (!Utils.isNullOrEmpty(t.getDescription())) {
                transformedYaml.append("    description: ").append(t.getDescription()).append("\n");
            }
        }
        return transformedYaml.toString();
    }

    private String transformYamlApiSpec(ApiSpec apiSpec) {
        StringBuilder transformedYaml = new StringBuilder();

        transformedYaml.append("openapi: ").append(apiSpec.getOpenapi()).append("\n");
        transformedYaml.append("info:").append("\n");

        Info info = apiSpec.getInfo();

        transformedYaml.append("  title: ").append(info.getTitle()).append("\n");

        if (!Utils.isNullOrEmpty(info.getDescription())) {
            transformedYaml.append("  description: ").append(info.getDescription()).append("\n");
        }

        if (!Utils.isNullOrEmpty(info.getTermsOfService())) {
            transformedYaml.append("  termsOfService: ").append(info.getTermsOfService()).append("\n");
        }

        transformedYaml.append("  version: ").append(info.getVersion()).append("\n");

        if (info.getContact() != null && (!Utils.isNullOrEmpty(info.getContact().getEmail()) || !Utils.isNullOrEmpty(info.getContact().getName()) || !Utils.isNullOrEmpty(info.getContact().getUrl()))) {
            transformedYaml.append("  contact:").append("\n");
            if (!Utils.isNullOrEmpty(info.getContact().getName())) {
                transformedYaml.append("    name: ").append(info.getContact().getName()).append("\n");
            }
            if (!Utils.isNullOrEmpty(info.getContact().getEmail())) {
                transformedYaml.append("    email: ").append(info.getContact().getEmail()).append("\n");
            }
            if (!Utils.isNullOrEmpty(info.getContact().getUrl())) {
                transformedYaml.append("    url: ").append(info.getContact().getUrl()).append("\n");
            }
        }

        if (info.getLicense() != null && !Utils.isNullOrEmpty(info.getLicense().getName()) && !Utils.isNullOrEmpty(info.getLicense().getUrl())) {
            transformedYaml.append("  license:").append("\n");
            transformedYaml.append("    name: ").append(info.getLicense().getName()).append("\n");

            if (!Utils.isNullOrEmpty(info.getLicense().getUrl())) {
                transformedYaml.append("    url: ").append(info.getLicense().getUrl()).append("\n");
            }
        }

        if (apiSpec.getExternalDocs() != null && !Utils.isNullOrEmpty(apiSpec.getExternalDocs().getUrl())) {
            transformedYaml.append("externalDocs:").append("\n");
            transformedYaml.append("  url: ").append(apiSpec.getExternalDocs().getUrl()).append("\n");

            if (!Utils.isNullOrEmpty(apiSpec.getExternalDocs().getDescription())) {
                transformedYaml.append("  description: ").append(apiSpec.getExternalDocs().getDescription()).append("\n");
            }

        }

        if (!Utils.isNullOrEmpty(apiSpec.getServers())) {
            transformedYaml.append("servers:").append("\n");
            for (Server server: apiSpec.getServers()) {
                transformedYaml.append("  - url: ").append(server.getUrl()).append("\n");
                if (!Utils.isNullOrEmpty(server.getDescription())) {
                    transformedYaml.append("    description: ").append(server.getDescription()).append("\n");
                }
            }
        }

        return transformedYaml.toString();
    }

    public String buildYaml(ApiSpec apiSpec, String yamlComponents) {

        String yamlSpec = transformYamlApiSpec(apiSpec);

        String yamlTags = transformYamlTags(apiSpec.getTags());

        StringBuilder yamlPathsBuilder = new StringBuilder();
        for(Tag t: apiSpec.getTags()){
            for (Path p: t.getPaths()) {
                yamlPathsBuilder.append(transformYamlPaths(p));
            }
        }

        StringBuilder builder = new StringBuilder();
        builder.append(yamlSpec);
        builder.append("tags:\n");
        builder.append(yamlTags);
        builder.append("paths:\n");
        builder.append(yamlPathsBuilder);
        builder.append("components:\n");
        builder.append(yamlComponents);


        return builder.toString();
    }

    public String formatYaml(String yamlString) {
        // Configura le opzioni di formattazione
        DumperOptions options = new DumperOptions();
        options.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK); // Formato a blocchi invece di inline

        // Crea un'istanza di Yaml con le opzioni di formattazione
        Yaml yaml = new Yaml(options);

        // Analizza il YAML in un oggetto
        Object yamlObject = yaml.load(yamlString);

        // Verifica se l'oggetto è una mappa
        if (yamlObject instanceof Map) {
            // Cast dell'oggetto a una mappa
            Map<String, Object> yamlMap = (Map<String, Object>) yamlObject;

            // Serializza la mappa in una stringa YAML formattata
            return yaml.dump(yamlMap);
        } else {
            // Il YAML non rappresenta una mappa valida
            return yamlObject.toString();
        }
    }

}
