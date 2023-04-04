import { IUserTagGrantability } from './IUserTagGrantability';

export type TUserTagIDReserved = 'owner'
	| 'admin'
	| 'post'
	| 'user_read'
	| 'user_write'
	| 'group_write'
	| 'page_write'
	| 'user-tag_write'
	| 'group-tag_write'
	| 'page-tag_write'
	| 'apitoken_write'
	| 'subject_write'
	| 'subject-category_write'
	| 'subject-semester_write'
	| 'subject-week_write'
	| 'teacher_write'
	| 'place_write';

export interface IUserTag {
	readonly id: TUserTagIDReserved | string;
	name: string;
	displayName: string;
	grantableBy: IUserTagGrantability[];
}
