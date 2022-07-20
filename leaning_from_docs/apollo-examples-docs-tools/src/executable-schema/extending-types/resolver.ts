import { makeExecutableSchema } from '@graphql-tools/schema';
const barsResolver = {
  Query: {
    bars(parent, args, context, info) {
      // ...
    },
  },
};

const foosResolver = {
  Query: {
    foos(parent, args, context, info) {
      // ...
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [barsResolver, foosResolver],
});
