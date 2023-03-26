export interface IPropertyPlain<Key extends string = string> {
	readonly id: string;
	readonly key: Key;
	readonly type: 'plain';
	value?: string;
}
