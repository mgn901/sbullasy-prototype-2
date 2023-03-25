import { EntityAsync } from '../EntityAsync';
import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { db } from '../kysely/db';
import { IProperty } from '../property/IProperty';
import { ISubject } from './ISubject';
import { ISubjectRepository } from './ISubjectRepository';
import { Subject } from './Subject.kysely';

export class SubjectRepository implements ISubjectRepository {

	public async findByID(id: string): Promise<EntityAsync<ISubject> | undefined> {
		const subjects = await this.findByIDs(id);
		const subject = subjects[0];
		return subject;
	}

	public async findByIDs(...ids: string[]): Promise<EntityAsync<ISubject>[]> {
		const subjectsPartial = await db
			.selectFrom('subjects')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const subjects = subjectsPartial.map((subjectPartial) => {
			const subject = new Subject(subjectPartial, db);
			return subject;
		});
		return subjects;
	}

	public async findAll(): Promise<EntityAsync<ISubject>[]> {
		const subjectsPartial = await db
			.selectFrom('subjects')
			.selectAll()
			.execute();
		const subjects = subjectsPartial.map((subjectPartial) => {
			const subject = new Subject(subjectPartial, db);
			return subject;
		});
		return subjects;
	}

	public async save(subject: ISubject | EntityAsync<ISubject>): Promise<void> {
		const teachers = await subject.teachers;
		const categories = await subject.categories;
		const places = await subject.places;
		const properties = await subject.properties;
		const oldProperties = await db
			.selectFrom('subjects_properties')
			.where('subject_id', '==', subject.id)
			.select('property_id')
			.execute();
		const teacherIDs = teachers.map(teacher => teacher.id);
		const categoryIDs = categories.map(category => category.id);
		const placeIDs = places.map(place => place.id);
		const propertyIDs = properties.map(property => property.id);
		const oldPropertyIDs = oldProperties.map(oldProperty => oldProperty.property_id);
		const subjectPartial: EntityWithoutEntityKey<ISubject> = {
			id: subject.id,
			code: subject.code,
			name: subject.name,
			nameRuby: subject.nameRuby,
			class: subject.class,
			grade: subject.grade,
			semester: subject.semester,
			week: subject.week,
			units: subject.units,
			updatedAt: subject.updatedAt,
		};

		await db
			.deleteFrom('subjects_teachers')
			.where('subject_id', '==', subject.id)
			.where('teacher_id', 'not in', teacherIDs)
			.executeTakeFirst();
		teacherIDs.forEach(async (teacherID) => {
			const subjectsTeachersItem = {
				subject_id: subject.id,
				teacher_id: teacherID,
			};
			await db
				.insertInto('subjects_teachers')
				.values(subjectsTeachersItem)
				.onConflict(oc => oc
					.columns(['subject_id', 'teacher_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('subjects_categories')
			.where('subject_id', '==', subject.id)
			.where('category_id', 'not in', categoryIDs)
			.executeTakeFirst();
		categoryIDs.forEach(async (categoryID) => {
			const subjectsCategoriesItem = {
				subject_id: subject.id,
				category_id: categoryID,
			};
			await db
				.insertInto('subjects_categories')
				.values(subjectsCategoriesItem)
				.onConflict(oc => oc
					.columns(['subject_id', 'category_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('subjects_places')
			.where('subject_id', '==', subject.id)
			.where('place_id', 'not in', placeIDs)
			.executeTakeFirst();
		placeIDs.forEach(async (placeID) => {
			const subjectsPlacesItem = {
				subject_id: subject.id,
				place_id: placeID,
			};
			await db
				.insertInto('subjects_places')
				.values(subjectsPlacesItem)
				.onConflict(oc => oc
					.columns(['subject_id', 'place_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('subjects_properties')
			.where('subject_id', '==', subject.id)
			.where('property_id', 'not in', propertyIDs)
			.executeTakeFirst();
		await db
			.deleteFrom('properties')
			.where('id', 'in', oldPropertyIDs)
			.where('id', 'not in', propertyIDs)
			.executeTakeFirst();
		properties.map(async (property) => {
			const user = await property.user;
			const group = await property.group;
			const page = await property.page;
			const propertyPartial: EntityWithoutEntityKey<IProperty> = {
				id: property.id,
				key: property.key,
				value: property.value,
				user: user?.id,
				group: group?.id,
				page: page?.id,
			};
			const subjectsPropertiesItem = {
				subject_id: subject.id,
				property_id: property.id,
			};
			await db
				.insertInto('properties')
				.values(propertyPartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(propertyPartial)
				)
				.executeTakeFirst();
			await db
				.insertInto('subjects_properties')
				.values(subjectsPropertiesItem)
				.onConflict(oc => oc
					.columns(['subject_id', 'property_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.insertInto('subjects')
			.values(subjectPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(subjectPartial))
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		const subject = await this.findByID(id);
		const properties = await subject?.properties ?? [];
		const propertyIDs = properties.map(property => property.id);

		await db
			.deleteFrom('subjects_teachers')
			.where('subject_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('subjects_categories')
			.where('subject_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('subjects_places')
			.where('subject_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('subjects_properties')
			.where('subject_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('properties')
			.where('id', 'in', propertyIDs)
			.executeTakeFirst();

		return;
	}

}
