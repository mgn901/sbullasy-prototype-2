import { IGroupTag } from './group-tag/IGroupTag';
import { IGroup } from './group/IGroup';
import { ILoginFailure } from './login-failure/ILoginFailure';
import { IPageTag } from './page-tag/IPageTag';
import { IPage } from './page/IPage';
import { IPlace } from './place/IPlace';
import { IProperty } from './property/IProperty';
import { IResetPasswordRequest } from './reset-password-request/IResetPasswordRequest';
import { ISession } from './session/ISession';
import { IUndoChangeEmailRequest } from './undo-change-email-request/IUndoChangeEmailRequest';
import { IUserTagRequest } from './user-tag-request/IUserTagRequest';
import { IUserTag } from './user-tag/IUserTag';
import { IUserTagGrantability } from './user-tag/IUserTagGrantability';
import { IUser } from './user/IUser';
import { IUserTagRegistration } from './user/IUserTagRegistration';

export type Entity = IUser
	| IGroup
	| IPage
	| IUserTag
	| IUserTagRegistration
	| IGroupTag
	| IPageTag
	| IUserTagGrantability
	| IPlace
	| IProperty
	| ISession
	| IUserTagRequest
	| IUndoChangeEmailRequest
	| IResetPasswordRequest
	| ILoginFailure;
