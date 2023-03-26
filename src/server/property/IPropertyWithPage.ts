import { IPage } from '../page/IPage';

export interface IPropertyWithPage<Key extends string = string> {
	readonly id: string;
	readonly key: Key;
	readonly type: 'page';
	value?: IPage;
}
