import { GraphQLSchema } from 'graphql';
import enumsHandler from './handlers/enumsHandler';
import nodesHandler from './handlers/nodesHandler';
import scalarsHandler from './handlers/scalarsHandler';
import schemaHandler from './handlers/schemaHandler';
import { IConfig } from './types/index';

export const plugin = (schema: GraphQLSchema, documents: any, config: IConfig) => {
  const { enums, nodes, scalars, types } = schemaHandler(schema, config);
  const parsedEnums = enumsHandler(enums, types, config);
  const parsedNodes = nodesHandler(nodes, config, types);
  const parsedScalars = scalarsHandler(scalars, types, config);

  return [
    `import { z } from 'zod';`,
    config.importOperationTypesFrom
      ? `import * as Types from '${config.importOperationTypesFrom}'`
      : '',
    parsedScalars,
    parsedEnums,
    parsedNodes,
  ].join('\n\n');
};
