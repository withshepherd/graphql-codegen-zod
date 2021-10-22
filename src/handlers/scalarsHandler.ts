import { IScalars, ITypes } from '../types';

const scalarsHandler = (scalars: IScalars, types: ITypes): string => {
  return Object.keys(scalars)
    .map((key) => {
      let schemaName = `export const ${key}Schema`;

      if (types[key]) {
        schemaName += `: z.ZodSchema<${types[key]}>`;
      }

      return `${schemaName} = ${scalars[key]};`;
    })
    .join('\n');
};

export default scalarsHandler;
