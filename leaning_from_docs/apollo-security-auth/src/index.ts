import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
const dotenvConf = dotenv.config();
expand(dotenvConf);

import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginDrainHttpServer,
  AuthenticationError,
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
import { User } from './blog/types';

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

      let user: User;
      try {
        // const user = { id: '123', email: 'test', password: 'test pass' };
        user = await usersAuth.getUserFromToken(token);
      } catch (error) {
        const decoded = usersAuth.decodeJwtToken(token);
        const email = decoded.payload['email'];
        throw new AuthenticationError(`update jwt token for user ${email}`, {
          email,
        });
      }

      return {
        token,
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

  const corsOptions = {
    origin: ['https://www.your-app.example', 'https://studio.apollographql.com'],
    credentials: true,
  };
  server.applyMiddleware({ app, cors: corsOptions });
  const port = process.env.PORT;
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer({}, {});
