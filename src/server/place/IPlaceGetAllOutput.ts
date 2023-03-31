import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlaceGetAllOutput {
	places: EntityWithoutEntityKey<IPlace>[];
}
