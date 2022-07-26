import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { GraphQLSchema } from 'graphql';
import schema from './schema';

async function startApolloServer(schema: GraphQLSchema) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // optional
      ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.PORT;
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer(schema);
