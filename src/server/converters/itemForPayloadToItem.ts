import { IAttribute, IItem } from '../models/interfaces.ts';
import { IItemForPayload } from '../schemas/IItemForPayload.ts';
import { attributesForPayloadToAttributes } from './attributesForPayloadToAttributes.ts';

export const itemForPayloadToItem = (options: {
  item: IItemForPayload;
  itemId: IItem['id'];
  type: IItem & { attributes: IAttribute[] };
  attributesExists?: IAttribute[];
}): Pick<IItem, 'id' | 'name' | 'isPublic' | 'typeId'> & { attributes: IAttribute[] } => {
  const { item, itemId, type, attributesExists } = options;
  const { name, isPublic } = item;
  const attributes = attributesForPayloadToAttributes({
    attributesForPayload: item.attributes,
    itemId,
    type,
    attributesExists,
  });

  return {
    id: itemId,
    name,
    typeId: type.id,
    isPublic,
    attributes,
  };
};
