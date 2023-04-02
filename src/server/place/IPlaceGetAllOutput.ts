import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlaceGetAllOutput {
	places: EntityWithoutEntityKey<IPlace>[];
}
