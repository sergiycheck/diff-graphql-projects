import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';
import Keyv from 'keyv';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import responseCachePlugin from 'apollo-server-plugin-response-cache';

import schema from '../schema';

async function startApolloServer(schema: GraphQLSchema) {
  const redis_port = process.env.REDIS_PORT;
  const redis_host = process.env.REDIS_HOST;

  const keyVInstance = new Keyv(`redis://${redis_host}:${redis_port}`);
  const keyVAdapter = new KeyvAdapter(keyVInstance);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    introspection: true,
    cache: keyVAdapter,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      responseCachePlugin(),
    ],
  });

  const port = process.env.PORT;
  await new Promise<void>((resolve) => server.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer(schema);
