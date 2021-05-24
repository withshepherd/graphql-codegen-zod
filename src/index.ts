import { GraphQLSchema } from 'graphql';
import nodesHandler from './handlers/node/index';
import schemaHandler from './handlers/schema/index';
import { IConfig } from './types/index';

export const plugin = (schema: GraphQLSchema, documents: any, config: IConfig) => {
  const hanlded = schemaHandler(schema, config.onlyWithConstrain);
  const parsedNodes = nodesHandler(hanlded, config);
  return `import { z } from 'zod'\n\n ${parsedNodes}`;
};
