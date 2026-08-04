package base;

public class TestDataFactory {

    public static String unique(String baseName) {
        return baseName + "-" + System.currentTimeMillis();
    }
}
