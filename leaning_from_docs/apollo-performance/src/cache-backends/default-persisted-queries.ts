import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { GraphQLSchema } from 'graphql';
import schema from '../schema';

async function startApolloServer(schema: GraphQLSchema) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',

    persistedQueries: {
      ttl: 900, //15 minutes

      // ttl: null // to disable TTL entirely
    },

    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),
      // redirect instantly to apollo sandbox
      // ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.PORT;
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer(schema);
