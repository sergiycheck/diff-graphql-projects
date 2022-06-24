import { ApolloServer } from 'apollo-server';

const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }) {
        response.http.headers.set('Custom-Header', 'hello');
        if (response?.errors?.[0]?.message === 'teapot') {
          response.http.status = 418;
        }
      },
    };
  },
};

const server = new ApolloServer({
  typeDefs: ``,
  resolvers: {},
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [setHttpPlugin],
});
