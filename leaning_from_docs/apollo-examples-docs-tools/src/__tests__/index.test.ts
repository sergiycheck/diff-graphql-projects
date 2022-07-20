import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from '../resolver';

describe('index requests tests', () => {
  test('returns hello with the provided name', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const result = await testServer.executeOperation({
      query: /* GraphQL */ `
        query SayHelloWorld($name: String) {
          hello(name: $name)
        }
      `,
      variables: { name: 'world' },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.hello).toBe('Hello world!');
  });
});
