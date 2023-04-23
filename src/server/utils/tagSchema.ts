import { Type } from '@sinclair/typebox';

export const tagSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	displayName: Type.String(),
});
