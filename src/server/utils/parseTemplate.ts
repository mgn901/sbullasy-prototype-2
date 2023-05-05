import { TTokenizer, tokenize } from './tokenize';

type TCharacterToken = {
	type: 'character';
	value: string;
};

type TIdentifierToken = {
	type: 'identifier';
	value: string;
}

type TToken = TCharacterToken | TIdentifierToken;

const templateTokenier: TTokenizer<TToken> = (nextCharacter) => {
	const tokens: TToken[] = [];
	while (true) {
		const current = nextCharacter();

		if (!current) {
			break;
		}

		if (current === '\\') {
			const next = nextCharacter();

			if (next === '<' || next === '>') {
				tokens.push({
					type: 'character',
					value: next,
				});
				continue;
			}

			tokens.push({
				type: 'character',
				value: current + next,
			});

			continue;
		}

		if (current === '<') {
			let variableTokenValue = '';

			while (true) {
				let next = nextCharacter();

				if (!next) {
					tokens.push({
						type: 'character',
						value: '<' + variableTokenValue,
					});
					break;
				}

				if (next === '>') {
					tokens.push({
						type: 'identifier',
						value: variableTokenValue,
					});
					break;
				}

				variableTokenValue += next;
			}

			continue;
		}

		tokens.push({
			type: 'character',
			value: current,
		});
	}
	return tokens;
}

export const parseTemplate = (template: string): (params: Record<string, string>) => string => {
	const tokens = tokenize(template, templateTokenier);
	const identifiers = tokens.filter(token => token.type === 'identifier');

	const useTemplate = (params: Record<typeof identifiers[number]['value'], string>) => {
		let generatedString = '';
		tokens.forEach((token) => {
			if (token.type === 'character') {
				generatedString += token.value;
				return;
			}
			generatedString += params[token.value];
		});
		return generatedString;
	}

	return useTemplate;
}
