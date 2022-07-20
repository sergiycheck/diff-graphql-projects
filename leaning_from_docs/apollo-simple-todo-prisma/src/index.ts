import 'reflect-metadata';
import { prismaInstance } from './constants';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
const dotenvConf = dotenv.config();
expand(dotenvConf);

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { loadFiles } from '@graphql-tools/load-files';
import { ContextType } from './common.types';
import Container from 'typedi';
import UserService from './blog/user.service';
import PostService from './blog/post.service';
import { CustomLog } from './logger/customLogger';
import prisma from './prisma.config';

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  Container.set(prismaInstance, prisma);

  const context: ContextType = {
    userService: Container.get(UserService),
    postsService: Container.get(PostService),
  };

  const server = new ApolloServer({
    typeDefs: await loadFiles('src/**/*.{gql, graphql}'),
    resolvers: await loadFiles('src/**/*.resolver.ts'),
    csrfPrevention: true,
    cache: 'bounded',
    context,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.PORT;
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  CustomLog.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer({}, {});
