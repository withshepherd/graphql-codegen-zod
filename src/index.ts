import { GraphQLSchema } from 'graphql';
import enumsHandler from './handlers/enumsHandler';
import nodesHandler from './handlers/nodesHandler';
import schemaHandler from './handlers/schemaHandler';
import { IConfig } from './types/index';

export const plugin = (schema: GraphQLSchema, documents: any, config: IConfig) => {
  const hanlded = schemaHandler(schema, config.onlyWithConstrain);
  const parsedEnums = enumsHandler(hanlded.enums);
  const parsedNodes = nodesHandler(hanlded, config);
  return `import { z } from 'zod';\n\n${parsedEnums}\n\n${parsedNodes}`;
};
