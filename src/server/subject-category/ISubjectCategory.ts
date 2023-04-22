export interface ISubjectCategory {
	readonly id: string;
	name: string;
	displayName: string;
	description: string;
	requiredUnits?: number;
	studentIDRegex: string[];
}
