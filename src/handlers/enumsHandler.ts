import { IEnums, ITypes } from '../types';

const enumsHandler = (enums: IEnums, types: ITypes): string => {
  return Object.keys(enums)
    .map((key) => {
      let schemaName = `export const ${key}Schema`;

      if (types[key]) {
        schemaName += `: z.ZodSchema<${types[key]}>`;
      }

      return `${schemaName} = z.enum(${JSON.stringify(enums[key])});`;
    })
    .join('\n');
};

export default enumsHandler;
