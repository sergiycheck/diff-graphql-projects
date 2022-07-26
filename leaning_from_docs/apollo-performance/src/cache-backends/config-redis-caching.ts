import dotenv from 'dotenv';
dotenv.config();

import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { GraphQLSchema } from 'graphql';
import Keyv from 'keyv';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';

import schema from '../schema';

// connect to redis docs
// https://github.com/luin/ioredis#connect-to-redis

async function startApolloServer(schema: GraphQLSchema) {
  const app = express();
  const httpServer = http.createServer(app);

  const redis_port = process.env.REDIS_PORT;
  const redis_host = process.env.REDIS_HOST;

  const keyVInstance = new Keyv(`redis://${redis_host}:${redis_port}`);
  const keyVAdapter = new KeyvAdapter(keyVInstance);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,

    cache: keyVAdapter,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.PORT;
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer(schema);
