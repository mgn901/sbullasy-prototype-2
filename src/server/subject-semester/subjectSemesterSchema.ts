import { Type } from '@sinclair/typebox';

export const subjectSemesterSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	displayName: Type.String(),
	startsAt: Type.Number(),
	endsAt: Type.Number(),
});
