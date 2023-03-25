export interface ILoginFailure {
	readonly id: string;
	readonly type: 'email' | 'password';
	readonly value: string;
	readonly failuredAt: number;
}
