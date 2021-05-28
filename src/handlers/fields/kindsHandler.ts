import { NamedTypeNode, TypeNode } from 'graphql';
import { isNamed } from '../../types/index';
import { isArray, isRequired, isType } from '../../utils/typesCheckers';
import fieldNamedTypeHandler from './namedTypesHandlers';

const fieldKindHandler = (type: NamedTypeNode | TypeNode, extra = '', isOptional = true) => {
  let result = '';

  if (isRequired(type.kind)) {
    result = `${fieldKindHandler(
      // @ts-expect-error
      type.type,
      extra,
      false,
    )}`;
  }

  if (isArray(type.kind)) {
    result = `z.array(${fieldKindHandler(
      // @ts-expect-error
      type.type,
      extra,
      isOptional,
    )})`;

    if (isOptional) {
      result = `z.optional(${result})`;
    }
  }

  if (isType(type.kind) && isNamed(type)) {
    result = fieldNamedTypeHandler(type.name.value);
    result = `${result}${extra}`;

    if (isOptional) {
      result = `z.optional(${result})`;
    }
  }

  return result;
};

export default fieldKindHandler;
