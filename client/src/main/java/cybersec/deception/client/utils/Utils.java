package cybersec.deception.client.utils;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class Utils {

    // Controlla se una stringa è vuota o null
    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    // Controlla se una stringa è composta solo da spazi bianchi
    public static boolean isWhitespace(String str) {
        return str != null && str.trim().isEmpty();
    }

    // Controlla se una stringa è un numero intero
    public static boolean isInteger(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }

        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    // Tronca una stringa alla lunghezza desiderata
    public static String truncate(String str, int maxLength) {
        if (isNullOrEmpty(str) || maxLength <= 0) {
            return str;
        }

        return str.length() > maxLength ? str.substring(0, maxLength) : str;
    }

    public static <T> boolean isNullOrEmpty(T[] array) {
        return array == null || array.length == 0;
    }

    public static <T> boolean isNullOrEmpty(List<T> array) {
        return array == null || array.isEmpty();
    }

    public static <T> boolean isNullOrEmpty(Map<T, T> array) {
        return array == null || array.isEmpty();
    }

    public static void removeEmptyStrings(List<String> stringList, String valueToRemove) {

        stringList.removeIf(str -> str.equals(valueToRemove));
    }

    public static void removeEmptyStrings(List<String> stringList) {

        removeEmptyStrings(stringList, "");
    }

}
