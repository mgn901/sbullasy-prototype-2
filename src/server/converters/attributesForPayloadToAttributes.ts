import { generateId } from '../interactors/utils/generateId.ts';
import { IItem, IAttribute } from '../models/interfaces.ts';
import { IItemForPayload } from '../schemas/IItemForPayload.ts';

export const attributesForPayloadToAttributes = (options: {
  attributesForPayload: IItemForPayload['attributes'];
  attributesExists?: IAttribute[];
  itemId: IItem['id'];
  type: IItem & { attributes: IAttribute[] };
}): IAttribute[] => {
  const { attributesForPayload, attributesExists, itemId, type } = options;
  const typeId = type.id;

  const attributeDefinitionMap = type.attributes.reduce<Map<string, IAttribute>>(
    (map, attribute) => {
      map.set(attribute.key, attribute);
      return map;
    },
    new Map<string, IAttribute>(),
  );

  const attributeExistsMap = attributesExists?.reduce<Map<string, IAttribute | IAttribute[]>>(
    (map, attribute) => {
      const { key } = attribute;
      if (key.endsWith('[]')) {
        const exists = map.get(key) ?? [];
        if (!Array.isArray(exists)) {
          return map;
        }
        map.set(key, [...exists, attribute]);
        return map;
      }
      map.set(key, attribute);
      return map;
    },
    new Map<string, IAttribute | IAttribute[]>(),
  );

  const convert = (
    key: string,
    value: Exclude<IItemForPayload['attributes'][string], Array<unknown>>,
  ) => {
    // The id of the same-key attribute
    // If attribute is array, the id of the same-key and same-value attribute
    const id =
      (() => {
        const attributeExists = attributeExistsMap?.get(key);
        if (Array.isArray(attributeExists)) {
          const attribute = attributeExists.find((_attribute) => {
            if (typeof value === 'string') return _attribute.valueString === value;
            if (typeof value === 'number') return _attribute.valueNumber === value;
            if (typeof value === 'boolean') return _attribute.valueBoolean === value;
            return _attribute.valueItemId === value.id;
          });
          return attribute?.id;
        }
        return attributeExists?.id;
      })() ?? generateId();

    return {
      id,
      key,
      parentId: itemId,
      parentItemTypeId: typeId,
      showOnSummary: attributeDefinitionMap.get(key)?.showOnSummary ?? false,
      valueString: typeof value === 'string' ? value : null,
      valueNumber: typeof value === 'number' ? value : null,
      valueBoolean: typeof value === 'boolean' ? value : null,
      valueItemId: typeof value === 'object' && value.id ? value.id : null,
    };
  };

  return Object.entries(attributesForPayload)
    .map<IAttribute | IAttribute[]>(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((_value) => convert(key, _value));
      }
      return convert(key, value);
    })
    .reduce<IAttribute[]>((result, attribute) => {
      if (!Array.isArray(attribute)) {
        result.push(attribute);
        return result;
      }
      result.push(...attribute);
      return result;
    }, []);
};
