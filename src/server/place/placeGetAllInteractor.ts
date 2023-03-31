import { IInteractorParams } from '../IInteractorParams';
import { IPlace } from './IPlace';
import { IPlaceGetAllInput } from './IPlaceGetAllInput';
import { IPlaceGetAllOutput } from './IPlaceGetAllOutput';
import { IPlaceRepository } from './IPlaceRepository';

interface IPlaceGetAllInteractorParams extends IInteractorParams<
	IPlaceRepository,
	IPlaceGetAllInput,
	IPlace
> { }

export const placeGetAllInteractor = async (params: IPlaceGetAllInteractorParams): Promise<IPlaceGetAllOutput> => {
	const { repository, input } = params;

	const places = await repository.findAll();
	const output: IPlaceGetAllOutput = {
		places: places,
	};

	return output;
}
