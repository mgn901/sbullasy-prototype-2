import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlaceCreateOutput {
	place: TEntityWithoutEntityKey<IPlace>;
}
