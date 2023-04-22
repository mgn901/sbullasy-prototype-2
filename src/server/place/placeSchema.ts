import { Type } from '@sinclair/typebox';

export const placeSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	numbering: Type.String(),
});
