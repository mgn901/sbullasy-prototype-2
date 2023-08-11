import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IGroup, IUser } from '../models/interfaces.ts';
import { IInteractorOptions } from './IInteractorOptions.ts';
import { generateId } from './utils/generateId.ts';
import { generateLongToken } from './utils/generateLongToken.ts';

export const startInteractor = async (
  options: IInteractorOptions<{
    adminUserEmail: string;
  }>,
) => {
  const { repository, query } = options;
  const { adminUserEmail } = query;

  const adminUserId = generateId();
  const now = dateToUnixTimeMillis(new Date());
  const user: IUser = {
    id: adminUserId,
    email: adminUserEmail,
    name: 'admin',
    displayName: 'admin',
    registeredAt: now,
    registrationExpiresAt: null,
    verificationExpiresAt: null,
  };

  const adminGroupId = generateId();
  const invitationCode = generateLongToken();
  const adminGroup: IGroup = {
    id: adminGroupId,
    name: 'admin',
    displayName: 'admin',
    createdAt: now,
    invitationCode,
    isAdmin: true,
  };

  await repository.user.create({
    data: user,
  });

  await repository.group.create({
    data: {
      ...adminGroup,
      members: {
        create: {
          type: 'admin',
          userId: adminUserId,
        },
      },
    },
  });
};
