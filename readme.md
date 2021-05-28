# GRAPHQL SCHEMA TO ZOD SCHEMA

The reason for this project is to maintain a single source of truth, between graphql and zod. Inspired by https://github.com/tinezmatias/codegen-graphql-yup

## Configs

- defaultRequiredMessage: string, this message is overwrited if you use requeridMessage in the directive.
- onlyWithConstrain: boolean ( default false) If you want to generate an schema for all your input objects definitions with or without the directive put it in true.

You can use this pluggin de dos formas distintas

### Simple use

If you only want to validate the required fields, what you can do is use the plugin in the following way

```yaml
generates:
  schemas.ts:
    plugins:
      - codegen-graphql-zod:
          defaultRequiredMessage: "You can put it or not"
```

### Full Use

If you need more validations than only required fields, you have to follow this steps.

this is because in graphql instrospection we dont have access to directives

1. Add the directive in your schema.
2. Generate a file, the result of merge of all schemas.
   Example:

   ```ts
   import path from 'path';
   import fs from 'fs';
   const mergeGraphqlSchemas = require('merge-graphql-schemas');

   const { fileLoader } = mergeGraphqlSchemas;
   const { mergeTypes } = mergeGraphqlSchemas;

   const types = fileLoader(path.join(__dirname, '/entities/**/*.graphql'));

   const mt = mergeTypes(types, { all: true });

   try {
       fs.writeFileSync('./result.graphql', mt);
   } catch (error) { }

   export default mt;
   ```

3. In codegen.yml config use that file like schema.

### Directive Schema

```graphql
directive @validation(
  pattern: String
  min: Int
  max: Int
  requiredMessage: String
  typeOf: String
) on INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

## Example

result.graphql

```graphql
directive @validation(
  pattern: String
  min: Int
  max: Int
  requiredMessage: String
  typeOf: String
) on INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION

input TestInput {
  something: String!
}

input RegisterAddressInput {
  postalCode: TestInput! @validation(requiredMessage: "It field have custom message.")
  state: [String]!
  city: String!
  someNumber: Int @validation(min: 10, max: 20)
  someNumberFloat: Float @validation(min: 10.50, max: 20.50)
  someBoolean: Boolean
  line2: String @validation(min: 10, max: 20)
}

```

codegen.yml

```yaml
overwrite: true
schema: "./result.graphql"
generates:
  schemas.ts:
    plugins:
      - codegen-graphql-zod:
          defaultRequiredMessage: "This field have generic message"
          onlyWithConstrain: false

```

schemas.ts ( THE RESULT )

```ts
import {z} from 'zod'

export const TestInputSchema = zod.object().shape({
    something: zod.string().required('This field have generic message')
});

export const RegisterAddressInputSchema = zod.object().shape({
    postalCode: TestInputSchema.required('It field have custom message.'),
    state: zod.arrayOf(zod.string()).required('This field have generic message'),
    city: zod.string().required('This field have generic message'),
    someNumber: zod.number().min(10).max(20),
    someNumberFloat: zod.number().min(10.5).max(20.5),
    someBoolean: zod.boolean(),
    line2: zod.string().min(10).max(20)
})

```

