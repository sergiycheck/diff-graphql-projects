const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginUsageReporting } = require('apollo-server-core');

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      //ensures that any error that starts with Known error message is not transmitted to Apollo Studio
      ApolloServerPluginUsageReporting({
        rewriteError(err) {
          // Using a more stable, known error property (e.g. `err.code`) would be
          // more defensive, however checking the `message` might serve most needs!
          if (err.message && err.message.startsWith('Known error message')) {
            return null;
          }

          const apiKeyRegex = /x-api-key:[A-Z0-9-]+/;
          if (`${err.message}`.match(apiKeyRegex)) {
            // Make sure that a specific pattern is removed from all error messages.
            err.message = err.message.replace(apiKeyRegex, 'REDACTED');
            return err;
          }

          // All other errors should still be reported!
          return err;
        },
      }),
    ],
  });
}
