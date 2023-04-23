import { Type } from '@sinclair/typebox';
import { propertyWithoutEntityKeySchema } from '../property/propertyWithoutEntityKeySchema';
import { tagSchema } from '../utils/tagSchema';

export const userForPublicSchema = Type.Object({
	id: Type.String(),
	displayName: Type.String(),
	tags: Type.Array(tagSchema),
	properties: Type.Array(propertyWithoutEntityKeySchema),
});
