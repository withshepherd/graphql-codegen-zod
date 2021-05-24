import { IConfig, IHandled } from '../../types/index';
import fieldsHandler from '../fields';

const nodesHandler = (handled: IHandled, config: IConfig) => {
  return handled.nodes
    .map(({ name, fields }) => {
      const fieldsZod = fieldsHandler(fields, config, handled);
      return `export const ${name}Schema = z.object({\n${fieldsZod}\n})`;
    })
    .join(';\n\n');
};

export default nodesHandler;
