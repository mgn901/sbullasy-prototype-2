import {
  Attribute,
  Bookmark,
  Group,
  Item,
  Membership,
  Permission,
  RequestFromUser,
  Token,
  User,
} from './.prisma/client';

export type IUser = User;
export type IGroup = Group;
export type IMembership = Membership;
export type IBookmark = Bookmark;
export type IToken = Token;
export type IRequestFromUser = RequestFromUser;
export type IPermission = Permission;
export type IItem = Item;
export type IAttribute = Attribute;
