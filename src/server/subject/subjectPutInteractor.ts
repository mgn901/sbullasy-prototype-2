import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { TEntityAsync } from '../TEntityAsync';
import { WrongParamsError } from '../error/WrongParamsError';
import { IGroupRepository } from '../group/IGroupRepository';
import { IInteractorParams } from '../IInteractorParams';
import { IPageRepository } from '../page/IPageRepository';
import { IPlaceRepository } from '../place/IPlaceRepository';
import { ISubjectCategoryRepository } from '../subject-category/ISubjectCategoryRepository';
import { ISubjectSemesterRepository } from '../subject-semester/ISubjectSemesterRepository';
import { ISubjectWeekRepository } from '../subject-week/ISubjectWeekRepository';
import { ITeacherRepository } from '../teacher/ITeacherRepository';
import { IUserRepository } from '../user/IUserRepository';
import { propertiesWithoutEntityKeyToProperties } from '../utils/propertiesWithoutEntityKeyToProperties';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubject } from './ISubject';
import { ISubjectPutInput } from './ISubjectPutInput';
import { ISubjectPutOutput } from './ISubjectPutOutput';
import { ISubjectRepository } from './ISubjectRepository';
import { subjectToSubjectForPublic } from './subjectToSubjectForPublic';

interface ISubjectPutInteractorParams extends IInteractorParams<
	ISubjectRepository,
	ISubjectPutInput,
	ISubject
> {
	userRepository: IUserRepository;
	groupRepository: IGroupRepository;
	pageRepository: IPageRepository;
	teacherRepository: ITeacherRepository;
	categoryRepository: ISubjectCategoryRepository;
	semesterRepository: ISubjectSemesterRepository;
	weekRepository: ISubjectWeekRepository;
	placeRepository: IPlaceRepository;
}

export const subjectPutInteractor = async (params: ISubjectPutInteractorParams): Promise<ISubjectPutOutput> => {
	const { repository, input, userRepository, groupRepository, pageRepository, teacherRepository, categoryRepository, semesterRepository, weekRepository, placeRepository } = params;
	const subjectPartial = input.subject;
	const teachers = await teacherRepository.findByIDs(...subjectPartial.teachers);
	const categories = await categoryRepository.findByIDs(...subjectPartial.categories);
	const semesters = await semesterRepository.findByIDs(...subjectPartial.semesters);
	const weeks = await weekRepository.findByIDs(...subjectPartial.weeks);
	const places = await placeRepository.findByIDs(...subjectPartial.places);
	const properties = await propertiesWithoutEntityKeyToProperties({
		propertiesPartial: subjectPartial.properties,
		userRepository: userRepository,
		groupRepository: groupRepository,
		pageRepository: pageRepository,
	});
	const now = dateToUnixTimeMillis(new Date());

	if (input.sessionID) {
		const verifySessionResult = await verifySession({
			sessionID: input.sessionID,
			userRepository: userRepository,
		});
		if (!verifySessionResult.status) {
			throw verifySessionResult.error;
		}

		const verifyUserTagResult = await verifyUserTag({
			userID: verifySessionResult.user.id,
			tagNeeded: 'subject_write',
			userRepository: userRepository,
		});
		if (!verifyUserTagResult.status) {
			throw verifyUserTagResult.error;
		}

	} else if (input.apiToken) {
		const verifycationResult = await verifyAPIToken({
			apiToken: input.apiToken,
			userRepository: userRepository,
			permissionNeeded: 'subject_write',
		});
		if (!verifycationResult.status) {
			throw verifycationResult.error;
		}

	} else {
		const error = new WrongParamsError({
			message: 'You have no credentials for the operation.',
		});
		throw error;
	}

	const subject: TEntityAsync<ISubject> = {
		id: subjectPartial.id,
		code: subjectPartial.code,
		name: subjectPartial.name,
		nameRuby: subjectPartial.nameRuby,
		teachers: teachers,
		categories: categories,
		classes: subjectPartial.classes,
		updatedAt: now,
		grades: subjectPartial.grades,
		semesters: semesters,
		weeks: weeks,
		places: places,
		units: subjectPartial.units,
		properties: properties,
	}
	await repository.save(subject);

	const subjectForPublic = await subjectToSubjectForPublic(subject);
	const output: ISubjectPutOutput = {
		subject: subjectForPublic,
	};

	return output;
}
