import { IRepository } from '../IRepository';
import { TEntityAsync } from '../TEntityAsync';
import { ISettingItem } from './ISettingItem';

export type ISettingItemRepository = Omit<IRepository<ISettingItem>, 'findByID'> & {
	findByID(id: ISettingItem['id']): Promise<TEntityAsync<ISettingItem>>;
};
