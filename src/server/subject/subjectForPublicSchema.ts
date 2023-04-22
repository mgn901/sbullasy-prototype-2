import { Type } from '@sinclair/typebox';
import { placeSchema } from '../place/placeSchema';
import { propertyWithoutEntityKeySchema } from '../property/propertyWithoutEntityKeySchema';
import { subjectWeekSchema } from '../subject-week/subjectWeekSchema';
import { teacherSchema } from '../teacher/teacherForPublicSchema';
import { subjectSemesterSchema } from '../subject-semester/subjectSemesterSchema';
import { subjectCategorySchema } from '../subject-category/subjectCategorySchema';

export const subjectForPublicSchema = Type.Object({
	id: Type.String(),
	code: Type.Optional(Type.String()),
	name: Type.String(),
	nameRuby: Type.Optional(Type.String()),
	classes: Type.Array(Type.String()),
	updatedAt: Type.Number(),
	grades: Type.Array(Type.Number()),
	units: Type.Optional(Type.Number()),
	teachers: Type.Array(teacherSchema),
	categories: Type.Array(subjectCategorySchema),
	semesters: Type.Array(subjectSemesterSchema),
	weeks: Type.Array(subjectWeekSchema),
	places: Type.Array(placeSchema),
	properties: Type.Array(propertyWithoutEntityKeySchema),
});
