import { IAPIToken } from '../api-token/IAPIToken';
import { TEntity } from '../TEntity';
import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IGroupTag } from '../group-tag/IGroupTag';
import { IGroup } from '../group/IGroup';
import { IPageTag } from '../page-tag/IPageTag';
import { IPage } from '../page/IPage';
import { IPlace } from '../place/IPlace';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { ISubjectCategory } from '../subject-category/ISubjectCategory';
import { ISubjectSemester } from '../subject-semester/ISubjectSemester';
import { ISubjectWeek } from '../subject-week/ISubjectWeek';
import { ISubject } from '../subject/ISubject';
import { ITeacher } from '../teacher/ITeacher';
import { IUndoChangeEmailRequest } from '../undo-change-email-request/IUndoChangeEmailRequest';
import { IUserTagRequest } from '../user-tag-request/IUserTagRequest';
import { IUserTag } from '../user-tag/IUserTag';
import { IUserTagGrantability } from '../user-tag/IUserTagGrantability';
import { IUser } from '../user/IUser';
import { IUserTagRegistration } from '../user/IUserTagRegistration';
import { ICreateSessionRequest } from '../create-session-request/ICreateSessionRequest';
import { ISettingItem } from '../setting/ISettingItem';

type TJoinTable<
	I extends (TEntity | TEntity[] | undefined),
	J extends (TEntity | TEntity[] | undefined),
	K extends string,
	L extends string
> = {
	[k in K]: NonNullable<I> extends TEntity[]
	? NonNullable<I>[number]['id']
	: NonNullable<I> extends TEntity
	? NonNullable<I>['id']
	: never;
} & {
		[l in L]: NonNullable<J> extends TEntity[]
		? NonNullable<J>[number]['id']
		: NonNullable<J> extends TEntity
		? NonNullable<J>['id']
		: never;
	};

export interface TDatabase {
	users: TEntityWithoutEntityKey<IUser>;
	groups: Omit<TEntityWithoutEntityKey<IGroup>, 'owner'>;
	pages: Omit<TEntityWithoutEntityKey<IPage>, 'createdByUser' | 'createdByGroup'>;
	usertagregistrations: TEntityWithoutEntityKey<IUserTagRegistration>;
	usertags: TEntityWithoutEntityKey<IUserTag>;
	grouptags: TEntityWithoutEntityKey<IGroupTag>;
	pagetags: TEntityWithoutEntityKey<IPageTag>;
	usertaggrantabilities: TEntityWithoutEntityKey<IUserTagGrantability>;
	apitokens: TEntityWithoutEntityKey<IAPIToken>;
	subjects: TEntityWithoutEntityKey<ISubject>;
	categories: TEntityWithoutEntityKey<ISubjectCategory>;
	subjectsemesters: TEntityWithoutEntityKey<ISubjectSemester>;
	subjectweeks: TEntityWithoutEntityKey<ISubjectWeek>;
	teachers: TEntityWithoutEntityKey<ITeacher>;
	places: TEntityWithoutEntityKey<IPlace>;
	properties: TEntityWithoutEntityKey<TProperty>;
	settings: TEntityWithoutEntityKey<ISettingItem>;
	sessions: TEntityWithoutEntityKey<ISession>;
	createsessionrequests: TEntityWithoutEntityKey<ICreateSessionRequest>;
	usertagrequests: TEntityWithoutEntityKey<IUserTagRequest>;
	undochangeemailrequests: TEntityWithoutEntityKey<IUndoChangeEmailRequest>;
	user_properties: TJoinTable<IUser, IUser['properties'], 'user_id', 'property_id'>;
	user_owns_groups: TJoinTable<IGroup['owner'], IUser['owns'], 'user_id', 'group_id'>;
	users_belongs_groups: TJoinTable<IGroup['members'], IUser['belongs'], 'user_id', 'group_id'>;
	users_watches_groups: TJoinTable<IUser, IUser['watchesGroups'], 'user_id', 'group_id'>;
	users_watches_pages: TJoinTable<IUser, IUser['watchesPages'], 'user_id', 'page_id'>;
	user_pages: TJoinTable<IPage['createdByUser'], IUser['pages'], 'user_id', 'page_id'>;
	groups_tags: TJoinTable<IGroup, IGroup['tags'], 'group_id', 'tag_id'>;
	group_properties: TJoinTable<IGroup, IGroup['properties'], 'group_id', 'property_id'>;
	group_pages: TJoinTable<IPage['createdByGroup'], IGroup['pages'], 'group_id', 'page_id'>;
	pages_places: TJoinTable<IPage, IPage['places'], 'page_id', 'place_id'>;
	pages_tags: TJoinTable<IPage, IPage['tags'], 'page_id', 'tag_id'>;
	page_properties: TJoinTable<IPage, IPage['properties'], 'page_id', 'property_id'>;
	grouptag_grantableby_usertags: TJoinTable<IGroupTag, IGroupTag['grantableBy'], 'grouptag_id', 'usertag_id'>;
	pagetag_grantableby_usertags: TJoinTable<IPageTag, IPageTag['grantableBy'], 'pagetag_id', 'usertag_id'>;
	subjects_places: TJoinTable<ISubject, ISubject['places'], 'subject_id', 'place_id'>;
	subjects_categories: TJoinTable<ISubject, ISubject['categories'], 'subject_id', 'category_id'>;
	subjects_semesters: TJoinTable<ISubject, ISubject['semesters'], 'subject_id', 'semester_id'>;
	subjects_weeks: TJoinTable<ISubject, ISubject['weeks'], 'subject_id', 'week_id'>;
	subjects_teachers: TJoinTable<ISubject, ISubject['teachers'], 'subject_id', 'teacher_id'>;
	subjects_properties: TJoinTable<ISubject, ISubject['properties'], 'subject_id', 'property_id'>;
}
