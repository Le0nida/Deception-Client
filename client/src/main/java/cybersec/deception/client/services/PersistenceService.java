package cybersec.deception.client.services;

import cybersec.deception.client.utils.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersistenceService {

    @Value("${data.yaml.path}")
    private String yamlPath;

    @Value("${data.generalinfo.path}")
    private String generalInfoPath;

    @Value("${data.security.path}")
    private String securitySchemePath;
    private String currentDir = "";
    private String getFilePath(String filename, String username) {
        String extension = ".txt";
        if (currentDir.equals(generalInfoPath)) {
            extension = ".json";
        }
        else if (currentDir.equals(yamlPath)) {
            extension = ".yaml";
        }
        else if (currentDir.equals(securitySchemePath)) {
            extension = ".json";
        }
        return FileUtils.buildPath(currentDir, FileUtils.buildPath(username, filename+extension));
    }

    private String uploadFile(String fileContent, String filename, String username){

        String dirResponse = FileUtils.createDirectoryIfNotExists(FileUtils.buildPath(currentDir, username));
        if (dirResponse.equals("Failed to create directory"))
            return dirResponse;

        String filepath = getFilePath(filename, username);
        String response = FileUtils.createFileIfNotExists(filepath);

        if (response.equals("File created successfully")) {
            FileUtils.writeFile(filepath, fileContent);
        }
        return response;
    }

    private String retrieveFile(String filename,String username){
        String filepath = getFilePath(filename, username);
        return FileUtils.readFile(filepath);
    }

    private List<String> retrieveAllFiles(String username){
        String dirPath = FileUtils.buildPath(currentDir, username);
        String dirResponse = FileUtils.createDirectoryIfNotExists(dirPath);
        if (dirResponse.equals("Failed to create directory"))
            return null;

        return FileUtils.removeFileExtensions(FileUtils.listFiles(dirPath));
    }


    // Metodi pubblici -------------------------------------------------------------------------------------------------

    public List<String> retrieveAllYaml(String username){
        currentDir = yamlPath;
        return retrieveAllFiles(username);
    }
    
    public List<String> retrieveAllGeneralInfos(String username){
        currentDir = generalInfoPath;
        return retrieveAllFiles(username);
    }

    public List<String> retrieveAllSecuritySchemes(String username){
        currentDir = securitySchemePath;
        return retrieveAllFiles(username);
    }
    
    public String retrieveYaml(String filename,String username){
        currentDir = yamlPath;
        return retrieveFile(filename, username);
    }

    public String retrieveGeneralInfo(String filename,String username){
        currentDir = generalInfoPath;
        return retrieveFile(filename, username);
    }

    public String retrieveSecurityScheme(String filename,String username){
        currentDir = securitySchemePath;
        return retrieveFile(filename, username);
    }

    public String uploadYaml(String fileContent, String filename, String username){
        currentDir = yamlPath;
        return uploadFile(fileContent, filename, username);
    }

    public String uploadGeneralInfo(String fileContent, String filename, String username){
        currentDir = generalInfoPath;
        return uploadFile(fileContent, filename, username);
    }

    public String uploadSecurityScheme(String fileContent, String filename, String username){
        currentDir = securitySchemePath;
        return uploadFile(fileContent, filename, username);
    }
}
