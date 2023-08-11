import { IAttribute, IItem } from '../models/interfaces.ts';
import { IItemWithAttributes } from '../schemas/IItemWithAttributes.ts';
import { attributesToAttributesForPayload } from './attributesToAttributesForPayload.ts';

export const itemToItemWithAttributes = (options: {
  item: IItem & {
    attributes: (IAttribute & { valueItem: IItem | null })[];
  } & {
    type: (IItem & { attributes: IAttribute[] }) | null;
  };
  forSummary: boolean;
}): IItemWithAttributes => {
  const { item, forSummary } = options;
  const { id, name, createdAt, updatedAt, isPublic, attributes } = item;
  const attributesForPayload = attributesToAttributesForPayload({ attributes, forSummary });

  return {
    id,
    name,
    createdAt,
    updatedAt,
    isPublic,
    attributes: attributesForPayload,
  };
};
