import { NamedTypeNode, TypeNode } from 'graphql';
import { IConfig, IHandled, isNamed } from '../../types/index';
import { isArray, isRequired, isType } from '../../utils/typesCheckers';
import fieldNamedTypeHandler from './namedTypesHandlers';

const fieldKindHandler = (type: NamedTypeNode | TypeNode, config: IConfig, handled: IHandled) => {
  let result = '';

  console.log(type, isArray(type.kind));

  if (isArray(type.kind)) {
    result = `z.array(${fieldKindHandler(
      // @ts-expect-error
      type.type,
      config,
      handled,
    )})`;
  }

  if (isRequired(type.kind)) {
    result = `${fieldKindHandler(
      // @ts-expect-error
      type.type,
      config,
      handled,
    )}`;
  }

  //   else if (type.kind && type.type) {
  //     result = `${fieldKindHandler(
  //       // @ts-expect-error
  //       type.type,
  //       config,
  //     )}.optional()`;
  //   }

  if (isType(type.kind) && isNamed(type)) {
    result = fieldNamedTypeHandler(type.name.value, config, handled);
  }

  //   @ts-expect-error
  if (handled.enums[type?.name?.value]) {
    //   @ts-expect-error
    result = `z.enum([${JSON.stringify(handled.enums[type.name?.value])}])`;
  }

  return result;
};

export default fieldKindHandler;
