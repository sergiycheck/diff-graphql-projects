import { ContextType } from './types';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
const dotenvConf = dotenv.config();
expand(dotenvConf);

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { loadFiles } from '@graphql-tools/load-files';
import DataLoader from 'dataloader';

import { getUsersSocialByIds } from './users/users.resolver';
import { domainLoader, getDomainByIds } from './domains/domain.resolver';
import { getUsersByIds, getPostsByIds } from './blog/common-data';

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs: await loadFiles('src/**/*.{gql, graphql}'),
    resolvers: await loadFiles('src/**/*.resolver.ts'),
    csrfPrevention: true,
    cache: 'bounded',
    context: (): ContextType => ({
      userSocialLoader: new DataLoader(getUsersSocialByIds),
      domainLoader: new DataLoader(getDomainByIds),

      userBlogLoader: new DataLoader(getUsersByIds),
      postBlogLoader: new DataLoader(getPostsByIds),
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.PORT;
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer({}, {});
