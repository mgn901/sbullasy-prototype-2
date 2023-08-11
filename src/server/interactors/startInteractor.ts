import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IGroup, IItem, IUser } from '../models/interfaces.ts';
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
  const now = dateToUnixTimeMillis(new Date());

  const rootExists = await repository.item.findUnique({
    where: {
      id: 'root',
    },
  });
  if (rootExists) {
    return;
  }

  const rootItem: IItem = {
    id: 'root',
    name: 'root',
    createdAt: now,
    updatedAt: now,
    isPublic: true,
    ownerId: null,
    typeId: null,
  };
  await repository.item.create({
    data: rootItem,
  });

  const adminUserId = generateId();
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
