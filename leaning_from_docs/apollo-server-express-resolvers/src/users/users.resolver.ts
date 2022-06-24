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
      return id ? users.find((user) => user.id === id) : users[0];
    },
  },
};

export default resolvers;
