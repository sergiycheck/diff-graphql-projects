import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
const dotenvConf = dotenv.config();
expand(dotenvConf);

import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { loadFiles } from '@graphql-tools/load-files';
import DataLoader from 'dataloader';
import { getUsersByIds, getPostsByIds } from './blog/common-data';

// for in memory users
import { updateUsers } from './blog/db-data';

updateUsers();

import usersAuth from './blog/users-auth';
import { ContextType } from './types';

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs: await loadFiles('src/**/*.{gql, graphql}'),
    resolvers: await loadFiles('src/**/*.resolver.ts'),
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req, res }): Promise<ContextType> => {
      // Note: This example uses the `req` argument to access headers,
      // but the arguments received by `context` vary by integration.
      // This means they vary for Express, Koa, Lambda, etc.
      //
      // To find out the correct arguments for a specific integration,
      // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

      const token = req.headers.authorization || '';

      const partOfContext = {
        userBlogLoader: new DataLoader(getUsersByIds),
        postBlogLoader: new DataLoader(getPostsByIds),
        usersAuth,
      };

      if (!token) {
        return partOfContext;
      }

      // Try to retrieve a user with the token
      const user = await usersAuth.getUserFromToken(token);
      // const user = { id: '123', email: 'test', password: 'test pass' };

      // Add the user to the context

      return {
        user,
        ...partOfContext,
      };
    },
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

startApolloServer({}, {});
