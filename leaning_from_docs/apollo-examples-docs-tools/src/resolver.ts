import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    helloDefault: String
    resolved: String
    hello(name: String): String
  }
`;

export const resolvers = {
  Query: {
    resolved: () => 'Resolved',
    hello: (_, { name }) => `Hello ${name}!`,
  },
};
