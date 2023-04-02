import { TEntityAsync } from '../TEntityAsync';
import { ISubject } from './ISubject';
import { TSubjectForPublic } from './TSubjectForPublic';

export const subjectToSubjectForPublicWithoutProperties = async (subject: TEntityAsync<ISubject>): Promise<Omit<TSubjectForPublic, 'properties'>> => {
	const teachers = await subject.teachers;
	const categories = await subject.categories;
	const semesters = await subject.semesters;
	const weeks = await subject.weeks;
	const places = await subject.places;

	const subjectForPublic: Omit<TSubjectForPublic, 'properties'> = {
		id: subject.id,
		code: subject.code,
		name: subject.name,
		nameRuby: subject.nameRuby,
		teachers: teachers,
		categories: categories,
		classes: subject.classes,
		updatedAt: subject.updatedAt,
		grades: subject.grades,
		semesters: semesters,
		weeks: weeks,
		places: places,
		units: subject.units,
	};

	return subjectForPublic;
}
