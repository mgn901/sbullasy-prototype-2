import { IAttribute, IItem } from '../models/interfaces.ts';
import { IItemWithAttributes } from '../schemas/IItemWithAttributes.ts';

export const attributesToAttributesForPayload = (options: {
  attributes: (IAttribute & { valueItem: IItem | null })[];
  forSummary: boolean;
}): IItemWithAttributes['attributes'] => {
  const { attributes, forSummary } = options;

  const attributesForPayloadMap = attributes.reduce<
    Map<string, IItemWithAttributes['attributes'][string]>
  >((map, attribute) => {
    if (forSummary && !attribute.showOnSummary) {
      return map;
    }

    const { key } = attribute;

    const value = (() => {
      const { valueString, valueNumber, valueBoolean, valueItem } = attribute;
      if (valueString) return valueString;
      if (valueNumber) return valueNumber;
      if (valueBoolean !== null) return valueBoolean;
      if (valueItem) return valueItem;
      return '';
    })();

    if (key.endsWith('[]')) {
      const exists = map.get(key);
      if (!Array.isArray(exists)) {
        const list = [];
        list.push(value);
        map.set(key, list as Extract<IItemWithAttributes['attributes'][string], Array<unknown>>);
        return map;
      }
      if (exists && typeof exists[0] === typeof value) {
        map.set(key, [...exists, value] as Extract<
          IItemWithAttributes['attributes'][string],
          Array<unknown>
        >);
        return map;
      }
      return map;
    }
    map.set(attribute.key, value);
    return map;
  }, new Map());

  return Object.fromEntries(attributesForPayloadMap.entries());
};
