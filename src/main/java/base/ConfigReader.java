package base;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigReader {

    private static Properties properties = new Properties();

    static {
        try (FileInputStream input = new FileInputStream("src/main/resources/config.properties")) {
            properties.load(input);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load configuration file.");
        }
    }

    public static String getProperty(String key) {
        return properties.getProperty(key);
    }

    public static String getBaseUrl() {
        String override = System.getProperty("baseUrl");
        if (override != null && !override.isEmpty()) {
            return override;
        }
        return properties.getProperty("baseUrl");
    }

    public static String getPageUrl(String key) {
        return getBaseUrl() + properties.getProperty(key);
    }
}
