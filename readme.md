# GraphQL codegen schema to Zod schema

The reason for this project is to maintain a single source of truth, between graphql and zod. This is useful for validation on forms. Inspired by [codegen-graphql-yup](https://github.com/tinezmatias/codegen-graphql-yup)

## Configs

- onlyWithValidation: boolean ( default false) If you want to generate an schema for all your input objects definitions with or without the directive put it in true.
- zodSchemasMap: a map of your scalars to a zod type. This is useful for scalars such as EmailAddress that are `z.string().email()`

### Simple use

If you only want to validate the required fields, what you can do is use the plugin in the following way

```yaml
generates:
  schemas.ts:
    plugins:
      - graphql-codegen-zod
```

### Full Use

If you need more validations than only required fields, you have to follow this steps.

this is because in graphql instrospection we dont have access to directives

- Add the directive in your schema.
- In codegen.yml config use that file like schema.

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
      - graphql-codegen-zod:
          onlyWithValidation: false

```
