import { IConfig, IHandled } from '../../types';
import { isBoolean, isNumber, isRef, isString } from '../../utils/typesCheckers';

const fieldNamedTypeHandler = (type: string, config: IConfig, handled: IHandled) => {
  let result = 'z.';

  if (isRef(type)) {
    result = type + 'Schema';
  } else if (isBoolean(type)) {
    result = result + 'boolean()';
  } else if (isString(type)) {
    result = result + 'string()';
  } else if (isNumber(type)) {
    result = result + 'number()';
  } else if (config.zodTypesMap[type]) {
    result = result + config.zodTypesMap[type];
  } else {
    // Assume it's a defined schema!
    result = type + 'Schema';
  }

  return result;
};

export default fieldNamedTypeHandler;
