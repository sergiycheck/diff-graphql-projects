const resolvers = {
  SearchResult: {
    __resolveType(obj, context, info) {
      // Only Author has a name field
      if (obj.name) {
        return 'Author';
      }
      // Only Book has a title field
      if (obj.title) {
        return 'Book';
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    search: () => {},
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
