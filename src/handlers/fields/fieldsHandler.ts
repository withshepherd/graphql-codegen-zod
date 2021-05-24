import { InputValueDefinitionNode } from 'graphql';
import { IConfig, IHandled } from '../../types';
import fieldHandler from './fieldHandlers';

const fieldsHandler = (fields: InputValueDefinitionNode[], config: IConfig, handled: IHandled) => {
  return fields.map((field) => fieldHandler(field, config, handled)).join(',\n');
};

export default fieldsHandler;
