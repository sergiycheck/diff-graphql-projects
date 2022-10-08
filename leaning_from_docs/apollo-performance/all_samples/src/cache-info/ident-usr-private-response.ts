import { ApolloServer } from 'apollo-server';
import responseCachePlugin from 'apollo-server-plugin-response-cache';

// Apollo Server caches up to two versions of each PUBLIC response:
// a null sessionId
// non-null sessionId
const server = new ApolloServer({
  // ...other settings...
  plugins: [
    responseCachePlugin({
      sessionId: (requestContext) =>
        requestContext.request.http.headers.get('session-id') || null,
    }),
  ],
});
