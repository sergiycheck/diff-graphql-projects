import DataLoader from 'dataloader';
import { ContextType } from 'src/types';

export type UserSocial = {
  id: string;
  name: string;
  bestFriendId: string;
};

const users: UserSocial[] = [
  {
    id: '1',
    name: 'Jamie',
    bestFriendId: '2',
  },
  {
    id: '2',
    name: 'Laurin',
    bestFriendId: '3',
  },
  {
    id: '3',
    name: 'Saihaj',
    bestFriendId: '2',
  },
];

export const getUserSocialById = (id: string): UserSocial => {
  console.log(`Calling getUserById for id: ${id}`);

  return users.find((d) => d.id === id);
};

export const getUsersSocialByIds = async (
  ids: readonly string[]
): Promise<UserSocial[]> => {
  return ids.map((id) => getUserSocialById(id));
};

const resolver = {
  Query: {
    users: (_parent, _args, context, info) => users,
  },
  UserSocial: {
    bestFriend: async (parent: UserSocial, _args, context: ContextType, info) => {
      const { bestFriendId } = parent;
      const { userSocialLoader } = context;
      // const user = await getUserSocialById(bestFriendId);
      const user = userSocialLoader.load(bestFriendId);
      return user;
    },
  },
};

export default resolver;
