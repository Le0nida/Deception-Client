package cybersec.deception.client.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class FileAuthenticationManager {

    @Value("${auth.credentials.filepath}")
    private String credentialsPath;

    @Value("${auth.loggedin.filepath}")
    private String loggedinPath;
    private Map<String, String> userCredentials;
    private Map<String, LocalDateTime> loggedInUsers;

    private void loadCredentialsFromFile() {
        userCredentials = new HashMap<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(credentialsPath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(":");
                if (parts.length == 2) {
                    String username = parts[0].trim();
                    String password = parts[1].trim();
                    userCredentials.put(username, password);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void loadLoggedInUsersFromFile() {
        loggedInUsers = new HashMap<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(loggedinPath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(":");
                if (parts.length == 2) {
                    String username = parts[0].trim();
                    LocalDateTime expirationTime = LocalDateTime.parse(parts[1].trim());
                    loggedInUsers.put(username, expirationTime);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public boolean login(String username, String password) {
        loadCredentialsFromFile();
        String storedPassword = userCredentials.get(username);
        addLoggedUser(username);
        return storedPassword != null && storedPassword.equals(password);
    }
    public boolean logout(String username) {
        if (isAuthenticated(username)){
            removeLoggedUser(username);
        }
        return !isUserLoggedIn(username);
    }

    public boolean userExists(String username) {
        loadCredentialsFromFile();
        return userCredentials.containsKey(username);
    }
    public boolean isAuthenticated(String username) {
        loadCredentialsFromFile();
        return userExists(username) && isUserLoggedIn(username);
    }
    private boolean isUserLoggedIn(String username) {
        loadLoggedInUsersFromFile();
        LocalDateTime expirationTime = loggedInUsers.get(username);
        if (expirationTime != null && expirationTime.isAfter(LocalDateTime.now())) {
            return true;
        }
        else {
            removeLoggedUser(username);
            return false;
        }
    }

    private void addLoggedUser(String username) {
        loadLoggedInUsersFromFile();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(60); // Scadenza dopo 60 minuti
        loggedInUsers.put(username, expirationTime);
        saveLoggedInUsersToFile();
    }

    private void removeLoggedUser(String username) {
        loadLoggedInUsersFromFile();
        loggedInUsers.remove(username);
        saveLoggedInUsersToFile();
    }

    private void saveLoggedInUsersToFile() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(loggedinPath))) {
            for (Map.Entry<String, LocalDateTime> entry : loggedInUsers.entrySet()) {
                writer.write(entry.getKey() + ":" + entry.getValue() + System.lineSeparator());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

