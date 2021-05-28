import { IConfig, INodes } from '../types/index';
import fieldsHandler from './fields';

const nodesHandler = (nodes: INodes[], config: IConfig) => {
  return nodes
    .map(({ name, fields }) => {
      const fieldsZod = fieldsHandler(fields, config);
      return `export const ${name}Schema = z.object({\n${fieldsZod}\n})`;
    })
    .join(';\n\n');
};

export default nodesHandler;
