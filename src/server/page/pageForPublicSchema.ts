import { Type } from '@sinclair/typebox';
import { propertyWithoutEntityKeySchema } from '../property/propertyWithoutEntityKeySchema';
import { tagSchema } from '../utils/tagSchema';
import { placeSchema } from '../place/placeSchema';
import { userForPublicSchema } from '../user/userForPublicSchema';
import { groupForPublicSchema } from '../group/groupForPublicSchema';

export const pageForPublicSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	type: Type.String(),
	createdAt: Type.Number(),
	updatedAt: Type.Number(),
	startsAt: Type.Optional(Type.Number()),
	endsAt: Type.Optional(Type.Number()),
	createdByUser: Type.Optional(userForPublicSchema),
	createdByGroup: Type.Optional(groupForPublicSchema),
	places: Type.Array(placeSchema),
	tags: Type.Array(tagSchema),
	properties: Type.Array(propertyWithoutEntityKeySchema),
});
