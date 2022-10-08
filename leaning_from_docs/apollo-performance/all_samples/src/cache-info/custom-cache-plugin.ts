import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';

const server = new ApolloServer({
  plugins: [
    ApolloServerPluginCacheControl({ calculateHttpHeaders: false }),
    {
      async requestDidStart() {
        return {
          async willSendResponse(requestContext) {
            const { response, overallCachePolicy } = requestContext;
            const policyIfCacheable = overallCachePolicy.policyIfCacheable();

            if (policyIfCacheable && !response.http.headers && response.http) {
              response.http.headers.set(
                'cache-control',
                // ... or the values your CDN recommends
                `max-age=0, s-maxage=${
                  overallCachePolicy.maxAge
                }, ${policyIfCacheable.scope.toLowerCase()}`
              );
            }
          },
        };
      },
    },
  ],
});
