import { groupToGroupSerializedForPublic } from '../../converters/groupToGroupSerializedForPublic.ts';
import { IGroupSerializedForPublic } from '../../schemas/IGroupSerializedForPublic.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';

export const findGroups = async (
  options: IInteractorOptions<{}>,
): Promise<IGroupSerializedForPublic[]> => {
  const { repository } = options;
  const groups = await repository.group.findMany();

  return groups.map(groupToGroupSerializedForPublic);
};
