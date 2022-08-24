import { ApolloServer, gql } from 'apollo-server-lambda';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { GraphQLResolveInfo } from 'graphql';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (_parent, _args, _context, _info: GraphQLResolveInfo) => {
      return 'Hello world!';
    },
  },
};
const isDev = process.env.NODE_ENV === 'dev';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context, express }) => {
    console.log('event', event);
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
      expressRequest: express.req,
    };
  },
  csrfPrevention: true,
  cache: 'bounded',
  introspection: isDev,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

exports.graphqlHandler = server.createHandler();
