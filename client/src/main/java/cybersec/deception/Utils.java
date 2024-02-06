package cybersec.deception;

public class Utils {
    // Controlla se una stringa è vuota o null
    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    // Controlla se una stringa è composta solo da spazi bianchi
    public static boolean isWhitespace(String str) {
        return str != null && str.trim().isEmpty();
    }


}
