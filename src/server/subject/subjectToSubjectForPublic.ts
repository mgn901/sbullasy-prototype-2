import { EntityAsync } from '../EntityAsync';
import { promisedMap } from '../utils/promisedMap';
import { propertyToPropertyWithoutEntityKey } from '../utils/propertyToPropertyWithoutEntityKey';
import { ISubject } from './ISubject';
import { TSubjectForPublic } from './TSubjectForPublic';

export const subjectToSubjectForPublic = async (subject: EntityAsync<ISubject>): Promise<TSubjectForPublic> => {
	const teachers = await subject.teachers;
	const categories = await subject.categories;
	const semesters = await subject.semesters;
	const weeks = await subject.weeks;
	const places = await subject.places;
	const properties = await subject.properties;
	const propertiesForPublic = await promisedMap(propertyToPropertyWithoutEntityKey, properties);

	const subjectForPublic: TSubjectForPublic = {
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
		properties: propertiesForPublic,
	};

	return subjectForPublic;
}
