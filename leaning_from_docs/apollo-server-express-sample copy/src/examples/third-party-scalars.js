const { ApolloServer, gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');

const typeDefs = gql`
  scalar JSON

  type MyObject {
    myField: JSON
  }

  type Query {
    objects: [MyObject]
  }
`;

const resolvers = {
  JSON: GraphQLJSON,
  // ...other resolvers...
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
