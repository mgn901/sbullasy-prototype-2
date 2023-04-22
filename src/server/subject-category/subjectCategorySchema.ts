import { Type } from '@sinclair/typebox';

export const subjectCategorySchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	displayName: Type.String(),
	description: Type.String(),
	requiredUnits: Type.Optional(Type.Number()),
	studentIDRegex: Type.Array(Type.String()),
});
