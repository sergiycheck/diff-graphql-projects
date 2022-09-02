import { ApolloServer, gql } from 'apollo-server-lambda';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { DocumentNode, GraphQLResolveInfo } from 'graphql';
import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

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

function getServer(typeDefs: DocumentNode, resolvers) {
  const isDev = process.env.NODE_ENV === 'dev';
  let server: ApolloServer;
  if (!server) {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ event, context, express }) => {
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
  }

  return server;
}

exports.graphqlHandler = async function (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) {
  const server = getServer(typeDefs, resolvers);
  const handler = server.createHandler();
  event.path = `/graphql`;
  const result = await handler(event, context, callback);

  return result;
};
