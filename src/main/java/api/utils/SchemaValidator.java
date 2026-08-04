package api.utils;

import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.Set;

/**
 * Utility for validating a JSON string against a JSON Schema file
 * placed in src/test/resources/schemas/.
 *
 * Usage:
 *   SchemaValidator.validate(responseBody, "employee-tracker-list.schema.json");
 */
public class SchemaValidator {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * Validates {@code jsonBody} against the given schema file name.
     * Throws {@link AssertionError} if any validation messages are returned.
     *
     * @param jsonBody     raw JSON string from the API response
     * @param schemaFile   file name (not path) inside src/test/resources/schemas/
     */
    public static void validate(String jsonBody, String schemaFile) {
        try {
            InputStream schemaStream = SchemaValidator.class
                    .getClassLoader()
                    .getResourceAsStream("schemas/" + schemaFile);
            if (schemaStream == null) {
                throw new IllegalArgumentException("Schema file not found on classpath: schemas/" + schemaFile);
            }

            JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7);
            JsonSchema schema = factory.getSchema(schemaStream);
            JsonNode jsonNode = MAPPER.readTree(jsonBody);

            Set<ValidationMessage> errors = schema.validate(jsonNode);
            if (!errors.isEmpty()) {
                StringBuilder sb = new StringBuilder("JSON schema validation failed for [")
                        .append(schemaFile).append("]:\n");
                errors.forEach(e -> sb.append("  - ").append(e.getMessage()).append("\n"));
                throw new AssertionError(sb.toString());
            }
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Schema validation error for [" + schemaFile + "]: " + e.getMessage(), e);
        }
    }
}
