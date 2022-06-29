import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { loadFiles } from '@graphql-tools/load-files';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const PORT = 4041;

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs: await loadFiles('src/**/*.{gql, graphql}'),
    resolvers: await loadFiles('src/**/*.resolver.ts'),
  });

  const server = new ApolloServer({
    debug: true,
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/graphql',
  });

  //context option is called once per subscription request, not once per event emission

  const getDynamicContext = async (ctx, msg, args) => {
    // ctx is the graphql-ws Context where connectionParams live
    if (ctx.connectionParams.authentication) {
      // const currentUser = await findUser(connectionParams.authentication);
      const currentUser = {};
      return { currentUser };
    }
    // Otherwise let our resolvers know we don't have a current user
    return { currentUser: null };
  };

  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        const authParams = ctx.connectionParams as unknown as string;
        if (!authParams) {
          throw new Error('Auth token missing!');
        }
      },
      onDisconnect(ctx, code, reason) {
        console.log('Disconnected!');
      },

      context: (ctx, msg, args) => {
        // You can define your own function for setting a dynamic context
        // or provide a static value
        return getDynamicContext(ctx, msg, args);
      },
    },
    wsServer
  );

  await server.start();
  server.applyMiddleware({ app });

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

startApolloServer();

// production PubSub libraries
//Redis
// Google PubSub
// MQTT enabled broker
// RabbitMQ
// Kafka
// Postgres
// Google Cloud Firestore
// Ably Realtime
// Google Firebase Realtime Database
// Azure SignalR Service
// Azure ServiceBus
