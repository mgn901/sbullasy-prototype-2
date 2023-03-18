export interface ILoginFailure {
	id: string;
	type: 'email' | 'password';
	value: string;
	failuredAt: number;
}
