import { IAPIToken } from './api-token/IAPIToken';
import { ISettingItem } from './setting/ISettingItem';
import { ICreateSessionRequest } from './create-session-request/ICreateSessionRequest';
import { IGroupTag } from './group-tag/IGroupTag';
import { IGroup } from './group/IGroup';
import { IPageTag } from './page-tag/IPageTag';
import { IPage } from './page/IPage';
import { IPlace } from './place/IPlace';
import { IPropertyPlain } from './property/IPropertyPlain';
import { IPropertyWithGroup } from './property/IPropertyWithGroup';
import { IPropertyWithPage } from './property/IPropertyWithPage';
import { IPropertyWithUser } from './property/IPropertyWithUser';
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

export type TEntity = IUser
	| IGroup
	| IPage
	| IUserTag
	| IUserTagRegistration
	| IGroupTag
	| IPageTag
	| IUserTagGrantability
	| IAPIToken
	| ISubject
	| ISubjectCategory
	| ISubjectSemester
	| ISubjectWeek
	| ITeacher
	| IPlace
	| IPropertyPlain
	| IPropertyWithUser
	| IPropertyWithGroup
	| IPropertyWithPage
	| ISettingItem
	| ISession
	| ICreateSessionRequest
	| IUserTagRequest
	| IUndoChangeEmailRequest;
