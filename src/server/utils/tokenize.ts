class TokenizerState {
	private string: string;
	private index: number;

	constructor(string: string) {
		this.string = string;
		this.index = 0;
	}

	public nextCharacter(): string {
		const character = this.string[this.index];
		this.index += 1;
		return character;
	}
}

export type TTokenizer<T> = (nextCharacter: () => string) => T[];

export const tokenize = <T>(source: string, tokenizer: TTokenizer<T>): T[] => {
	const state = new TokenizerState(source);
	const tokens = tokenizer(state.nextCharacter);
	return tokens;
}
