import { Type } from '@sinclair/typebox';

export const propertyWithoutEntityKeySchema = Type.Object({
	id: Type.String(),
	key: Type.String(),
	type: Type.Union([
		Type.Literal('plain'),
		Type.Literal('user'),
		Type.Literal('group'),
		Type.Literal('page'),
	]),
	value: Type.Optional(Type.String()),
});
