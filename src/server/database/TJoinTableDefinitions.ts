export type TJoinTableDefinitions<DB extends {}> = {
	[TN in keyof DB & string]?: {
		[CN in keyof DB[TN] & string]: {
			references: keyof DB & string;
		};
	};
}
