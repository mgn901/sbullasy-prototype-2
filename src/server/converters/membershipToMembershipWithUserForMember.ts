import { IMembership, IUser } from '../models/interfaces.ts';
import { IMembershipWithUserForMember } from '../schemas/IMembershipWithUserForMember.ts';
import { userToUserSerializedForOwner } from './userToUserSerializedForOwner.ts';

export const membershipToMembershipWithUserForMember = (
  membership: IMembership & { user: IUser },
): IMembershipWithUserForMember => {
  const { type, user } = membership;
  return { type, user: userToUserSerializedForOwner(user) };
};
