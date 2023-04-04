import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlacePutOutput {
	place: TEntityWithoutEntityKey<IPlace>;
}
