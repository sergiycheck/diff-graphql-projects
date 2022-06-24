const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');

const typeDefs = gql`
  scalar Date

  type Event {
    id: ID!
    date: Date!
  }

  type Query {
    events: [Event!]
  }
`;

const dateScalar = new GraphQLScalarType({
  // See definition above
});

const resolvers = {
  Date: dateScalar,
  // ...other resolver definitions...
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
});
