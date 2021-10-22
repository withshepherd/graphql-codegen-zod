import { GraphQLSchema } from 'graphql';
import enumsHandler from './handlers/enumsHandler';
import nodesHandler from './handlers/nodesHandler';
import scalarsHandler from './handlers/scalarsHandler';
import schemaHandler from './handlers/schemaHandler';
import { IConfig } from './types/index';

export const plugin = (schema: GraphQLSchema, documents: any, config: IConfig) => {
  const { enums, nodes, scalars, types } = schemaHandler(schema, config);
  const parsedEnums = enumsHandler(enums, types);
  const parsedNodes = nodesHandler(nodes, config, types);
  const parsedScalars = scalarsHandler(scalars, types);

  return [`import { z } from 'zod';`, parsedScalars, parsedEnums, parsedNodes].join('\n\n');
};
