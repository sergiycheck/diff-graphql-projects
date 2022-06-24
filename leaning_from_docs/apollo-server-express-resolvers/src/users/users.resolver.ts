import { UserInputError } from 'apollo-server-core';

const users = [
  {
    id: '1',
    name: 'Elizabeth Bennet',
  },
  {
    id: '2',
    name: 'Fitzwilliam Darcy',
  },
];

const resolvers = {
  Query: {
    user(parent, args, context, info) {
      const { id } = args;

      if (id < 1)
        throw new UserInputError(`arg ${id} is less than 1`, {
          argumentName: 'id',
        });

      return id ? users.find((user) => user.id === id) : users[0];
    },
  },
};

export default resolvers;
