import { Type } from '@sinclair/typebox';

export const teacherSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	nameRuby: Type.String(),
});
