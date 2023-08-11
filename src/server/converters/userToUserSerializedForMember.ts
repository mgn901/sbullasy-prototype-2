import { IUser } from '../models/interfaces.ts';
import { IUserSerializedForMember } from '../schemas/IUserSerializedForMember.ts';

export const userToUserSerializedForMember = (user: IUser): IUserSerializedForMember => {
  const { id, name, displayName, registeredAt, registrationExpiresAt, verificationExpiresAt } =
    user;
  return {
    id,
    name,
    displayName,
    registeredAt: registeredAt ?? undefined,
    registrationExpiresAt: registrationExpiresAt ?? undefined,
    verificationExpiresAt: verificationExpiresAt ?? undefined,
  };
};
