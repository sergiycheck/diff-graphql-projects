import { ContextType } from './types';
import { Context } from './../../../nexus/nexus-tutorial/api/context';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
const dotenvConf = dotenv.config();
expand(dotenvConf);

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { loadFiles } from '@graphql-tools/load-files';
import { userLoader } from './users/users.resolver';
import { domainLoader } from './domains/domain.resolver';

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs: await loadFiles('src/**/*.{gql, graphql}'),
    resolvers: await loadFiles('src/**/*.resolver.ts'),
    csrfPrevention: true,
    cache: 'bounded',
    context: (): ContextType => ({
      userLoader,
      domainLoader,
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
