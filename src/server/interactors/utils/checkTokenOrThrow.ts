import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IToken } from '../../models/interfaces.ts';
import { IRepository } from '../../repositories/IRepository.ts';
import { InvalidTokenError } from '../errors/InvalidTokenError.ts';

export const checkTokenOrThrow = async (
  repository: IRepository,
  requirements:
    | { requiresVerifiedUser: boolean }
    | { requiresAdminGroup: boolean }
    | {
        groupId: string;
        requiresAdminUser: boolean;
      }
    | {
        groupId: string;
        requiresAdminUser: boolean;
        itemTypeId: string;
        permissionType: 'read' | 'write';
      },
  fromClient?: {
    tokenType: 'bearer' | 'cookie';
    tokenId: string;
  },
): Promise<IToken> => {
  if (!fromClient) {
    throw new InvalidTokenError({
      message: 'Invalid token',
    });
  }
  const now = dateToUnixTimeMillis(new Date());
  const { tokenType, tokenId } = fromClient;
  if (tokenType === 'bearer') {
    const token = await repository.token.findUnique({
      where: {
        id: tokenId,
        type: tokenType,
      },
      include: {
        owner: true,
        permission: {
          include: {
            grantsTo: {
              include: { members: true },
            },
          },
        },
      },
    });
    if (!token || !token.permission) {
      throw new InvalidTokenError({
        message: 'Invalid token',
      });
    }

    const result = {
      isVerifiedUser:
        'requiresVerifiedUser' in requirements && requirements.requiresVerifiedUser
          ? (token.owner.verificationExpiresAt ?? now) > now
          : true,
      isAdminGroup: 'requiresAdminGroup' in requirements ? token.permission.grantsTo.isAdmin : true,
      groupId:
        'groupId' in requirements ? token.permission.grantsToId === requirements.groupId : true,
      isAdminUser:
        'requiresAdminUser' in requirements && requirements.requiresAdminUser
          ? token.permission.grantsTo.members.some(
              (membership) => membership.userId === token.ownerId && membership.type === 'admin',
            )
          : true,
      itemTypeId:
        'itemTypeId' in requirements
          ? token.permission.targetTypeId !== requirements.itemTypeId
          : true,
      isAccessible:
        'permissionType' in requirements
          ? token.permission.type !== requirements.permissionType
          : true,
    };

    Object.entries(result).forEach((entry) => {
      if (entry[1]) {
        return;
      }
      throw new InvalidTokenError({
        message: 'Missing permissions of the token',
        result,
      });
    });

    return token;
  }

  const token = await repository.token.findUnique({
    where: {
      id: tokenId,
    },
    include: {
      owner: {
        include: {
          belongsTo: {
            include: {
              group: {
                include: { permissions: true },
              },
            },
          },
        },
      },
    },
  });
  if (!token) {
    throw new InvalidTokenError({
      message: 'Invalid token',
    });
  }

  const result = {
    isVerifiedUser:
      'requiresVerifiedUser' in requirements
        ? (token.owner.verificationExpiresAt ?? now) > now
        : true,
    isAdminGroup:
      'requiresAdminGroup' in requirements && requirements.requiresAdminGroup === true
        ? token.owner.belongsTo.some((membership) => membership.group.isAdmin === true)
        : true,
    groupId:
      'groupId' in requirements
        ? token.owner.belongsTo.some((membership) => membership.groupId === requirements.groupId)
        : true,
    isAdminUser:
      'requiresAdminUser' in requirements
        ? token.owner.belongsTo.some(
            (membership) =>
              membership.groupId === requirements.groupId && membership.type === 'admin',
          )
        : true,
    itemTypeId:
      'itemTypeId' in requirements
        ? token.owner.belongsTo.some((membership) =>
            membership.group.permissions.some(
              (permission) => permission.targetTypeId === requirements.itemTypeId,
            ),
          )
        : true,
    isAccessible:
      'permissionType' in requirements
        ? token.owner.belongsTo.some((membership) =>
            membership.group.permissions.some(
              (permission) => permission.type === requirements.permissionType,
            ),
          )
        : true,
  };

  Object.entries(result).forEach((entry) => {
    if (entry[1]) {
      return;
    }
    throw new InvalidTokenError({
      message: 'Missing permissions of the token',
      result,
    });
  });

  return token;
};
