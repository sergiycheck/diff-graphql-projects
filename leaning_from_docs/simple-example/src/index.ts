import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { GraphQLResolveInfo } from "graphql";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (_parent, _args, _context, _info: GraphQLResolveInfo) => {
      return "Hello world!";
    },
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });
  const { url } = await server.listen({ port: 4042 });
  console.log(`🚀 Server ready at ${url}`);
}

startApolloServer(typeDefs, resolvers);
