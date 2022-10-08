import { ApolloServer } from 'apollo-server';
import responseCachePlugin from 'apollo-server-plugin-response-cache';

const server = new ApolloServer({
  // ...other options...
  plugins: [responseCachePlugin()],
});
