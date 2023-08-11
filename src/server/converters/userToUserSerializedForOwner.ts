import { IUser } from '../models/interfaces.ts';
import { IUserSerializedForOwner } from '../schemas/IUserSerializedForOwner.ts';

export const userToUserSerializedForOwner = (user: IUser): IUserSerializedForOwner => {
  const {
    id,
    email,
    name,
    displayName,
    registeredAt,
    registrationExpiresAt,
    verificationExpiresAt,
  } = user;
  return {
    id,
    email,
    name,
    displayName,
    registeredAt: registeredAt ?? undefined,
    registrationExpiresAt: registrationExpiresAt ?? undefined,
    verificationExpiresAt: verificationExpiresAt ?? undefined,
  };
};
