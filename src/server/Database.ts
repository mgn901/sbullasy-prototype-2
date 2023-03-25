import { IAPIToken } from './api-token/IAPIToken';
import { Entity } from './Entity';
import { EntityWithoutEntityKey } from './EntityWithoutEntityKey';
import { IGroupTag } from './group-tag/IGroupTag';
import { IGroup } from './group/IGroup';
import { ILoginFailure } from './login-failure/ILoginFailure';
import { IPageTag } from './page-tag/IPageTag';
import { IPage } from './page/IPage';
import { IPlace } from './place/IPlace';
import { IProperty } from './property/IProperty';
import { IResetPasswordRequest } from './reset-password-request/IResetPasswordRequest';
import { ISession } from './session/ISession';
import { ISubjectCategory } from './subject-category/ISubjectCategory';
import { ISubjectSemester } from './subject-semester/ISubjectSemester';
import { ISubjectWeek } from './subject-week/ISubjectWeek';
import { ISubject } from './subject/ISubject';
import { ITeacher } from './teacher/ITeacher';
import { IUndoChangeEmailRequest } from './undo-change-email-request/IUndoChangeEmailRequest';
import { IUserTagRequest } from './user-tag-request/IUserTagRequest';
import { IUserTag } from './user-tag/IUserTag';
import { IUserTagGrantability } from './user-tag/IUserTagGrantability';
import { IUser } from './user/IUser';
import { IUserTagRegistration } from './user/IUserTagRegistration';

type Junction<
	I extends (Entity | Entity[] | undefined),
	J extends (Entity | Entity[] | undefined),
	K extends string,
	L extends string
> = {
	[k in K]: NonNullable<I> extends Entity[]
	? NonNullable<I>[number]['id']
	: NonNullable<I> extends Entity
	? NonNullable<I>['id']
	: never;
} & {
		[l in L]: NonNullable<J> extends Entity[]
		? NonNullable<J>[number]['id']
		: NonNullable<J> extends Entity
		? NonNullable<J>['id']
		: never;
	};

export interface Database {
	users: EntityWithoutEntityKey<IUser>;
	groups: Omit<EntityWithoutEntityKey<IGroup>, 'owner'>;
	pages: Omit<EntityWithoutEntityKey<IPage>, 'createdByUser' | 'createdByGroup'>;
	usertagregistrations: EntityWithoutEntityKey<IUserTagRegistration>;
	usertags: EntityWithoutEntityKey<IUserTag>;
	grouptags: EntityWithoutEntityKey<IGroupTag>;
	pagetags: EntityWithoutEntityKey<IPageTag>;
	usertaggrantabilities: EntityWithoutEntityKey<IUserTagGrantability>;
	apitokens: EntityWithoutEntityKey<IAPIToken>;
	subjects: EntityWithoutEntityKey<ISubject>;
	categories: EntityWithoutEntityKey<ISubjectCategory>;
	subjectsemesters: EntityWithoutEntityKey<ISubjectSemester>;
	subjectweeks: EntityWithoutEntityKey<ISubjectWeek>;
	teachers: EntityWithoutEntityKey<ITeacher>;
	places: EntityWithoutEntityKey<IPlace>;
	properties: EntityWithoutEntityKey<IProperty>;
	sessions: EntityWithoutEntityKey<ISession>;
	usertagrequests: EntityWithoutEntityKey<IUserTagRequest>;
	undochangeemailrequests: EntityWithoutEntityKey<IUndoChangeEmailRequest>;
	resetpasswordrequests: EntityWithoutEntityKey<IResetPasswordRequest>;
	loginfailures: EntityWithoutEntityKey<ILoginFailure>;
	user_usertagregistrations: Junction<IUser, IUser['tagRegistrations'], 'user_id', 'registration_id'>;
	user_properties: Junction<IUser, IUser['properties'], 'user_id', 'property_id'>;
	user_owns_groups: Junction<IGroup['owner'], IUser['owns'], 'user_id', 'group_id'>;
	users_belongs_groups: Junction<IGroup['members'], IUser['belongs'], 'user_id', 'group_id'>;
	users_watches_groups: Junction<IUser, IUser['watchesGroups'], 'user_id', 'group_id'>;
	users_watches_pages: Junction<IUser, IUser['watchesPages'], 'user_id', 'page_id'>;
	user_pages: Junction<IPage['createdByUser'], IUser['pages'], 'user_id', 'page_id'>;
	groups_tags: Junction<IGroup, IGroup['tags'], 'group_id', 'tag_id'>;
	group_properties: Junction<IGroup, IGroup['properties'], 'group_id', 'property_id'>;
	group_pages: Junction<IPage['createdByGroup'], IGroup['pages'], 'group_id', 'page_id'>;
	pages_places: Junction<IPage, IPage['places'], 'page_id', 'place_id'>;
	pages_tags: Junction<IPage, IPage['tags'], 'page_id', 'tag_id'>;
	page_properties: Junction<IPage, IProperty['page'], 'page_id', 'property_id'>;
	grouptag_grantableby_usertags: Junction<IGroupTag, IGroupTag['grantableBy'], 'grouptag_id', 'usertag_id'>;
	pagetag_grantableby_usertags: Junction<IPageTag, IPageTag['grantableBy'], 'pagetag_id', 'usertag_id'>;
	subjects_places: Junction<ISubject, ISubject['places'], 'subject_id', 'place_id'>;
	subjects_categories: Junction<ISubject, ISubject['categories'], 'subject_id', 'category_id'>;
	subjects_semesters: Junction<ISubject, ISubject['semesters'], 'subject_id', 'semester_id'>;
	subjects_weeks: Junction<ISubject, ISubject['weeks'], 'subject_id', 'week_id'>;
	subjects_teachers: Junction<ISubject, ISubject['teachers'], 'subject_id', 'teacher_id'>;
	subjects_properties: Junction<ISubject, ISubject['properties'], 'subject_id', 'property_id'>;
}
