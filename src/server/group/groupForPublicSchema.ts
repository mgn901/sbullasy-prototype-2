import { Type } from '@sinclair/typebox';
import { propertyWithoutEntityKeySchema } from '../property/propertyWithoutEntityKeySchema';
import { tagSchema } from '../utils/tagSchema';

export const groupForPublicSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	tags: Type.Array(tagSchema),
	properties: Type.Array(propertyWithoutEntityKeySchema),
});
