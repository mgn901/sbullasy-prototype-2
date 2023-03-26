import { IPropertyPlain } from './IPropertyPlain';
import { IPropertyWithGroup } from './IPropertyWithGroup';
import { IPropertyWithPage } from './IPropertyWithPage';
import { IPropertyWithUser } from './IPropertyWithUser';

export type TProperty = IPropertyPlain
	| IPropertyWithUser
	| IPropertyWithGroup
	| IPropertyWithPage;
