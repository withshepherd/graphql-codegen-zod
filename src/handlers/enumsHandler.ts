import { IEnums } from '../types';

const enumsHandler = (enums: IEnums): string => {
  return Object.keys(enums)
    .map((key) => `export const ${key}Schema = z.enum(${JSON.stringify(enums[key])});`)
    .join('\n');
};

export default enumsHandler;
