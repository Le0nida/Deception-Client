package cybersec.deception.client.utils;

import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Component
public class FileUtils {

    private static final Logger logger = Logger.getLogger(FileUtils.class.getName());

    public static void checkEmptyFolder(String folderPath){
        if (!Utils.isNullOrEmpty(folderPath)) {
            createOrEmptyFolder(folderPath);
        }
        else {
            logger.severe("Il path della directory in input per contenere il server è vuoto");
        }
    }
    private static void createOrEmptyFolder(String folderPath) {
        File folder = new File(folderPath);

        // Verifica se la cartella esiste
        if (!folder.exists()) {
            // Se la cartella non esiste, prova a crearla
            boolean success = folder.mkdirs();
            if (!success) {
                System.err.println("Impossibile creare la cartella: " + folderPath);
                return;
            }
            System.out.println("Cartella creata: " + folderPath);
        } else {
            // Se la cartella esiste, svuotala
            emptyFolder(folder);
        }
    }

    private static void emptyFolder(File folder) {
        // Verifica se la cartella è una directory
        if (folder.isDirectory()) {
            File[] files = folder.listFiles();
            if (files != null) {
                // Svuota la cartella eliminando tutti i file al suo interno
                for (File file : files) {
                    if (file.isDirectory()) {
                        // Se è una sottocartella, svuotala ricorsivamente
                        emptyFolder(file);
                    } else {
                        // Se è un file, eliminalo
                        boolean deleted = file.delete();
                        if (!deleted) {
                            System.err.println("Impossibile eliminare il file: " + file.getAbsolutePath());
                        } else {
                            System.out.println("File eliminato: " + file.getAbsolutePath());
                        }
                    }
                }
            }
        }
    }
    public static void replaceStringInFile(String filePath, String searchString, String replacement) {
        // Leggi tutte le linee del file e trasformale in una lista di stringhe
        Path path = Paths.get(filePath);
        List<String> lines = null;
        try {
            lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Effettua la sostituzione della stringa in ogni linea
        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            // Effettua la sostituzione della stringa se presente
            lines.set(i, line.replace(searchString, replacement));
        }

        // Sovrascrivi il file con le linee modificate
        try {
            Files.write(path, lines, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        System.out.println("Sostituzione eseguita con successo nel file: " + filePath);
    }

    public static String readFile(String filePath) {
        try {
            return Files.lines(Paths.get(filePath)).collect(Collectors.joining("\n"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    public static String writeFile(String filePath, String content) {
        try {
            FileWriter fileWriter = new FileWriter(filePath);
            fileWriter.write(content);
            fileWriter.close();
            return "File written successfully";
        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to write file";
        }
    }


    public static void writeFile(String nomeFile, List<String> contenuto) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(nomeFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        for (String riga : contenuto) {
            try {
                writer.write(riga + "\n");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        try {
            writer.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static List<String> leggiFile(String nomeFile) {
        List<String> righe = new ArrayList<>();
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(nomeFile));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }

        String riga;
        while (true) {
            try {
                if ((riga = reader.readLine()) == null) break;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            righe.add(riga);
        }

        try {
            reader.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return righe;
    }

    public static File[] getFilesFilteredByExtension(String directory, String extension) {
        if (!Utils.isNullOrEmpty(directory)) {

            if (!extension.startsWith(".")){
                extension = "." + extension;
            }

            File folder = new File(directory);
            if (folder.isDirectory()) {
                String finalExtension = extension;
                return folder.listFiles((dir, name) -> name.toLowerCase().endsWith(finalExtension));
            }
        }
        return null;
    }

    public static String readFileContent(String filePath) {
        try {
            byte[] encodedBytes = Files.readAllBytes(Paths.get(filePath));
            return new String(encodedBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String createDirectoryIfNotExists(String directoryPath) {
        File directory = new File(directoryPath);
        if (directory.exists()) {
            return "Directory already exists";
        } else {
            if (directory.mkdirs()) {
                return "Directory created successfully";
            } else {
                return "Failed to create directory";
            }
        }
    }

    public static String createFileIfNotExists(String filePath) {
        File file = new File(filePath);
        try {
            if (file.exists()) {
                return "File already exists";
            } else {
                if (file.createNewFile()) {
                    return "File created successfully";
                } else {
                    return "Failed to create file";
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "Error occurred: " + e.getMessage();
        }
    }


    public static Map<String, String> readFilesContent(File[] files){
        Map<String, String> fileContentsMap = new HashMap<>();
        if (!Utils.isNullOrEmpty(files)) {
            for (File file : files) {
                String fileName = file.getName();
                String key = fileName.substring(0, fileName.lastIndexOf('.'));
                String content = FileUtils.readFileContent(file.getAbsolutePath());

                fileContentsMap.put(key, content);
            }
        }
        return fileContentsMap;
    }

    public static String validateJsonFileName(String fileName) {
        if (Utils.isNullOrEmpty(fileName)) {
            return null;
        }

        if (!fileName.endsWith(".json")){
            fileName = fileName + ".json";
        }
        return fileName;
    }

    public static String buildPath(String dir, String fileName) {
        return dir + File.separator + fileName;
    }

    public static void createFile(String yamlSpecFile, String serverSpecFileLocation) {
        try {
            File file = new File(serverSpecFileLocation);

            // Se il file non esiste, verrà creato
            file.createNewFile();

            try (FileOutputStream fos = new FileOutputStream(file)) {
                fos.write(yamlSpecFile.getBytes());
            }

        } catch (IOException e) {
            System.out.println("Si è verificato un errore durante la creazione del file.");
            e.printStackTrace();
        }
    }

    public static List<String> listFiles(String directoryPath) {
        List<String> fileList = new ArrayList<>();
        File directory = new File(directoryPath);

        // Verifica che il percorso specificato sia una directory
        if (directory.isDirectory()) {
            // Ottieni un array di file nella directory
            File[] files = directory.listFiles();
            if (files != null) {
                // Aggiungi i nomi dei file alla lista
                for (File file : files) {
                    if (file.isFile()) {
                        fileList.add(file.getName());
                    }
                }
            }
        } else {
            System.out.println("Il percorso specificato non è una directory.");
        }

        return fileList;
    }

    public static List<String> removeFileExtensions(List<String> fileList) {
        List<String> filenamesWithoutExtensions = new ArrayList<>();

        for (String filename : fileList) {
            filenamesWithoutExtensions.add(removeFileExtension(filename));
        }

        return filenamesWithoutExtensions;
    }

    public static String removeFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex != -1) {
            // Se l'estensione è presente, rimuovila
            return filename.substring(0, lastDotIndex);
        } else {
            // Se non ci sono estensioni, aggiungi semplicemente il nome del file alla nuova lista
           return filename;
        }
    }

    public static void deleteFile(String fileName) {
        File file = new File(fileName);

        if (file.exists()) {
            if (file.delete()) {
                System.out.println("Il file è stato eliminato con successo.");
            } else {
                System.out.println("Impossibile eliminare il file.");
            }
        } else {
            System.out.println("Il file non esiste.");
        }
    }
}
