export type TEntityTableDefinitions<DB extends {}> = {
	[TN in keyof DB & string]?: {
		[CN in keyof DB[TN] & string]: {
			type: DB[TN][CN] extends boolean
			? 'boolean'
			: DB[TN][CN] extends boolean[]
			? 'boolean[]'
			: DB[TN][CN] extends number
			? 'double precision'
			: DB[TN][CN] extends number[]
			? 'double precision[]'
			: DB[TN][CN] extends string[]
			? 'text[]'
			: 'text';
			isPrimaryKey?: CN extends 'id' ? true : false;
			isNotNull?: DB[TN][CN] extends NonNullable<DB[TN][CN]> ? true : false;
			references?: keyof DB & string;
		};
	};
}
