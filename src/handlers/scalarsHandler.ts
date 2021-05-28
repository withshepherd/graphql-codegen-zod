import { IScalars } from '../types';

const scalarsHandler = (scalars: IScalars): string => {
  return Object.keys(scalars)
    .map((key) => `export const ${key}Schema = z.${scalars[key]};`)
    .join('\n');
};

export default scalarsHandler;
