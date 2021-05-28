import { GraphQLSchema, InputValueDefinitionNode, parse, visit } from 'graphql';
import { printSchemaWithDirectives } from 'graphql-tools';
import { IConfig, IEnums, INodes, IScalars } from '../types/index';
import { DIRECTIVE_NAME } from '../utils/constants';

const schemaHandler = (schema: GraphQLSchema, config: IConfig) => {
  const printedSchema = printSchemaWithDirectives(schema);

  const astNode = parse(printedSchema);

  const nodes: INodes[] = [];
  const enums: IEnums = {};
  const scalars: IScalars = {};

  visit(astNode, {
    leave: {
      InputObjectTypeDefinition: (node) => {
        let hasValidation = Boolean(!config.onlyWithValidation);
        if (!hasValidation) {
          node.fields?.forEach((field: InputValueDefinitionNode) => {
            const validation = field.directives?.find(
              (directive) => directive.name.value === DIRECTIVE_NAME,
            );
            if (validation) {
              hasValidation = true;
            }
          });
        }
        if (hasValidation) nodes.push({ name: node.name.value, fields: [...node.fields!] });
      },
      EnumTypeDefinition: (node) => {
        if (node.values) {
          enums[node.name.value] = node.values?.map((e) => e.name.value);
        }
      },
      ScalarTypeDefinition: (node) => {
        if (config.zodTypesMap[node.name.value]) {
          scalars[node.name.value] = config.zodTypesMap[node.name.value];
        } else {
          throw new Error(
            `${node.name.value} is not a defined scalar. Please define it in the codegen.yml file`,
          );
        }
      },
    },
  });

  return { nodes, enums, scalars };
};

export default schemaHandler;
