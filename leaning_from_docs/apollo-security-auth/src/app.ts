import { ApolloServer, ExpressContext } from 'apollo-server-express';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  AuthenticationError,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { loadFiles } from '@graphql-tools/load-files';
import DataLoader from 'dataloader';
import { getUsersByIds, getPostsByIds } from './blog/common-data';
import usersAuth from './blog/users-auth';
import { ContextType } from './types';
import { User } from './blog/types';

export function createHttpServerAndConfig(app: ReturnType<typeof express>) {
  const configurations = {
    production: { ssl: true, port: process.env.PROD_PORT, hostname: 'localhost' },
    development: { ssl: false, port: process.env.DEV_PORT, hostname: 'localhost' },
  };

  const environment = process.env.NODE_ENV || 'production';
  const config = configurations[
    environment
  ] as typeof configurations[keyof typeof configurations];

  let httpServer: https.Server | http.Server;

  if (config.ssl) {
    // Assumes certificates are in a .ssl folder off of the package root.
    // Make sure these files are secured.
    const keyFullPath = path.resolve(
      process.cwd(),
      `./.ssl/${environment}/${process.env.SSL_PRIVATE_KEY}`
    );
    const certFullPath = path.resolve(
      process.cwd(),
      `./.ssl/${environment}/${process.env.SSL_CERTIFICATE}`
    );
    httpServer = https.createServer(
      {
        key: fs.readFileSync(keyFullPath),
        cert: fs.readFileSync(certFullPath),
      },
      app
    );
  } else {
    httpServer = http.createServer(app);
  }

  return {
    environment,
    httpServer,
    config,
  };
}

export async function createApolloServer(
  environment: string,
  httpServer: https.Server | http.Server
) {
  const server = new ApolloServer({
    typeDefs: await loadFiles('schema/**/*.{gql, graphql}'),
    resolvers: await loadFiles(
      `src/**/*.resolver.${environment === 'development' ? 'ts' : 'js'}`
    ),
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
        console.log(error);
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
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      // optional
      ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),
    ],
  });

  return { server };
}

export function configMiddleware(
  server: ApolloServer<ExpressContext>,
  app: ReturnType<typeof express>
) {
  const corsOptions = {
    origin: ['https://www.your-app.example', 'https://studio.apollographql.com'],
    credentials: true,
  };

  server.applyMiddleware({ app, cors: corsOptions });
}
