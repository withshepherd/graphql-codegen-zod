import { GraphQLSchema, InputValueDefinitionNode, parse, visit } from 'graphql';
import { printSchemaWithDirectives } from 'graphql-tools';
import { IEnums, INodes } from '../../types/index';
import { DIRECTIVE_NAME } from '../../utils/constants';

const schemaHandler = (schema: GraphQLSchema, onlyWithConstrain?: Boolean) => {
  const printedSchema = printSchemaWithDirectives(schema);

  const astNode = parse(printedSchema);

  const nodes: INodes[] = [];
  const enums: IEnums = {};

  visit(astNode, {
    leave: {
      InputObjectTypeDefinition: (node) => {
        let hasConstraint = Boolean(!onlyWithConstrain);
        if (!hasConstraint) {
          node.fields?.forEach((field: InputValueDefinitionNode) => {
            const constraint = field.directives?.find(
              (directive) => directive.name.value === DIRECTIVE_NAME,
            );
            if (constraint) {
              hasConstraint = true;
            }
          });
        }
        if (hasConstraint) nodes.push({ name: node.name.value, fields: [...node.fields!] });
      },
      EnumTypeDefinition: (node) => {
        if (node.values) {
          enums[node.name.value] = node.values?.map((e) => e.name.value);
        }
      },
    },
  });

  return { nodes, enums };
};

export default schemaHandler;
