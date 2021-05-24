import { InputValueDefinitionNode } from 'graphql';
import { IConfig, IHandled } from '../../types';
import directiveHandler from '../directives/index';
import fieldKindHandler from './kindsHandler';

const fieldHandler = (field: InputValueDefinitionNode, config: IConfig, handled: IHandled) => {
  const fieldName = field.name.value;
  const fieldType = field.type;

  const { extraValidations, requiredMessage } = directiveHandler(field.directives);

  const reqMessage = requiredMessage || config.defaultRequiredMessage || '';
  let arg = fieldKindHandler(fieldType, config, handled);

  for (const key in extraValidations) {
    if (Object.prototype.hasOwnProperty.call(extraValidations, key)) {
      const value = extraValidations[key];
      if (typeof value === 'string') {
        arg = `${arg}.${key}('${value}')`;
      } else {
        arg = `${arg}.${key}(${value})`;
      }
    }
  }
  return `${fieldName}: ${arg}`;
};

export default fieldHandler;
