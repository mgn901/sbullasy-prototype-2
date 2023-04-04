import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlaceGetAllOutput {
	places: TEntityWithoutEntityKey<IPlace>[];
}
