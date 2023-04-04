import { TEntityAsync } from '../TEntityAsync';
import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IGroupTag } from '../group-tag/IGroupTag';
import { IPageTag } from '../page-tag/IPageTag';
import { IUserTag } from '../user-tag/IUserTag';

export const tagToTagWithoutEntityKey = <T extends IUserTag | IGroupTag | IPageTag>(tag: TEntityAsync<T>): TEntityWithoutEntityKey<T> => {
	const tagWithoutEntityKey = {
		id: tag.id,
		name: tag.name,
		displayName: tag.displayName,
	};
	return tagWithoutEntityKey as TEntityWithoutEntityKey<T>;
}
