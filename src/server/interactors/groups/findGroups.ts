import { groupToGroupSerializedForPublic } from '../../converters/groupToGroupSerializedForPublic.ts';
import { IGroupSerializedForPublic } from '../../schemas/IGroupSerializedForPublic.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { IInteractorQuery } from '../IInteractorQuery.ts';

export const findGroups = async (
  options: IInteractorOptions<IInteractorQuery<'id_asc' | 'id_desc' | 'name_asc' | 'name_desc'>>,
): Promise<IGroupSerializedForPublic[]> => {
  const { repository } = options;
  const groups = await repository.group.findMany();

  return groups.map(groupToGroupSerializedForPublic);
};
