import { IGroup, IMembership } from '../models/interfaces.ts';
import { IMembershipWithGroupForMember } from '../schemas/IMembershipWithGroupForMember.ts';
import { groupToGroupSerializedForPublic } from './groupToGroupSerializedForPublic.ts';

export const membershipToMembershipWithGroupForMember = (
  membership: IMembership & { group: IGroup },
): IMembershipWithGroupForMember => {
  const { type, group } = membership;
  return { type, group: groupToGroupSerializedForPublic(group) };
};
