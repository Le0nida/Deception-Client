package cybersec.deception.client.utils;

import cybersec.deception.model.ServerBuildResponse;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipUtils {

    public static byte[] mapToBytes(Map<String, List<String>> map) {
        if (map == null || map.isEmpty()) {
            return null;
        }
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            oos.writeObject(map);
            oos.flush();
            byte[] byteArray = baos.toByteArray();
            oos.close();
            baos.close();
            return byteArray;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static byte[] createCombinedZip(ServerBuildResponse resp) throws IOException {
        return createCombinedZip(resp.getServerZipFile(), resp.getInstructions().getBytes(), mapToBytes(resp.getNotImplMethods()), resp.getServerDockerFile().getBytes());
    }

    private static byte[] createCombinedZip(byte[] zipFileBytes, byte[] txtFileBytes, byte[] notImplMethods, byte[] dockerImageBytes) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            // Aggiungi il file zip
            if (zipFileBytes != null) {
                addEntryToZip(zos, "server.zip", zipFileBytes);
            }

            // Aggiungi i file .txt
            if (txtFileBytes != null) {
                addEntryToZip(zos, "instructions.txt", txtFileBytes);
            }

            if (notImplMethods != null) {
                addEntryToZip(zos, "notImplMethods.txt", notImplMethods);
            }

            // Aggiungi l'immagine Docker
            if (dockerImageBytes != null) {
                addEntryToZip(zos, "Dockerfile", dockerImageBytes);
            }

            zos.finish();
            return baos.toByteArray();
        }
    }

    private static void addEntryToZip(ZipOutputStream zos, String entryName, byte[] content) throws IOException {
        ZipEntry entry = new ZipEntry(entryName);
        zos.putNextEntry(entry);
        zos.write(content);
        zos.closeEntry();
    }

}
