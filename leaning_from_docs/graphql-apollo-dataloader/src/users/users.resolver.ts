import DataLoader from 'dataloader';
import { ContextType } from 'src/types';

type User = {
  id: string;
  name: string;
  bestFriendId: string;
};

const users: User[] = [
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

export const getUserById = (id: string): User => {
  console.log(`Calling getUserById for id: ${id}`);

  return users.find((d) => d.id === id);
};

const getUsersByIds = async (ids: readonly string[]): Promise<User[]> => {
  return ids.map((id) => getUserById(id));
};

const resolver = {
  Query: {
    users: (_parent, _args, context, info) => users,
  },
  User: {
    bestFriend: async (parent: User, _args, context: ContextType, info) => {
      const { bestFriendId } = parent;
      const { userLoader } = context;
      // const user = await getUserById(bestFriendId);
      const user = userLoader.load(bestFriendId);
      return user;
    },
  },
};

export const userLoader = new DataLoader(getUsersByIds);

export default resolver;
