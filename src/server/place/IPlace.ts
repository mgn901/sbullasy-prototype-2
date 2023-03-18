import { EntityAsync } from '../EntityAsync';

export interface IPlace {
	id: string;
	name: string;
	numbering: string;
}

export type IPlaceAsync = EntityAsync<IPlace>;
