import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { GraphQLSchema } from 'graphql';

import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import schema from '../schema';
import cors from 'cors';

// InMemoryLRUCache class is a wrapper around the lru-cache package
// 30MiB of memory

async function startApolloServer(schema: GraphQLSchema) {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(cors());

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,

    cache: new InMemoryLRUCache({
      // ~100MiB
      maxSize: Math.pow(2, 20) * 100,
      // 5 minutes (in milliseconds)
      ttl: 300_000,
    }),

    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.PORT;
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer(schema);
