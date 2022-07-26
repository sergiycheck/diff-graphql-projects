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
import Keyv from 'keyv';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';

import schema from '../schema';

// InMemoryLRUCache class is a wrapper around the lru-cache package
// 30MiB of memory

async function startApolloServer(schema: GraphQLSchema) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: new KeyvAdapter(new Keyv()),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.PORT;
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer(schema);
