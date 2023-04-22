import { Type } from '@sinclair/typebox';

export const subjectWeekSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	displayName: Type.String(),
	posOnTimetable: Type.String(),
	startsAt: Type.Number(),
	endsAt: Type.Number(),
});
