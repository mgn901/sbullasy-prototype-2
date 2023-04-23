import { Type } from '@sinclair/typebox';

export const userTagWithExpiresAtSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	displayName: Type.String(),
	expiresAt: Type.Optional(Type.Number()),
});
