const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');

function deprecatedDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const deprecatedDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (deprecatedDirective) {
        fieldConfig.deprecationReason = deprecatedDirective['reason'];
        return fieldConfig;
      }
    },

    // Executes once for each enum value definition in the schema
    [MapperKind.ENUM_VALUE]: (enumValueConfig) => {
      const deprecatedDirective = getDirective(
        schema,
        enumValueConfig,
        directiveName
      )?.[0];
      if (deprecatedDirective) {
        enumValueConfig.deprecationReason = deprecatedDirective['reason'];
        return enumValueConfig;
      }
    },
  });
}
