package cybersec.deception.client.services;

import cybersec.deception.client.utils.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersistenceService {

    @Value("${data.yaml.path}")
    private String yamlDirPath;

    private String getYamlFilePath(String filename, String username) {
        return FileUtils.buildPath(yamlDirPath, FileUtils.buildPath(username, filename+".yaml"));
    }

    public String uploadFile(String fileContent, String filename, String username){

        String dirResponse = FileUtils.createDirectoryIfNotExists(FileUtils.buildPath(yamlDirPath, username));
        if (dirResponse.equals("Failed to create directory"))
            return dirResponse;

        String filepath = getYamlFilePath(filename, username);
        String response = FileUtils.createFileIfNotExists(filepath);

        if (response.equals("File created successfully")) {
            FileUtils.writeFile(filepath, fileContent);
        }
        return response;
    }

    public String retrieveFile(String filename,String username){
        String filepath = getYamlFilePath(filename, username);
        return FileUtils.readFile(filepath);
    }

    public List<String> retrieveAllFiles(String username){
        String dirPath = FileUtils.buildPath(yamlDirPath, username);
        String dirResponse = FileUtils.createDirectoryIfNotExists(dirPath);
        if (dirResponse.equals("Failed to create directory"))
            return null;

        return FileUtils.removeFileExtensions(FileUtils.listFiles(dirPath));
    }
}
