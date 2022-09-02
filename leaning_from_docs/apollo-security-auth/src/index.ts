import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
const dotenvConf = dotenv.config();
expand(dotenvConf);

import express from 'express';
import { updateUsers } from './blog/db-data';
import { createHttpServerAndConfig, createApolloServer, configMiddleware } from './app';
import createProxyForTheApp from './app-proxy';
import { logger } from './utils/logger';

async function startApolloServer(typeDefs, resolvers) {
  await updateUsers();

  const app = express();
  const { environment, httpServer, config } = createHttpServerAndConfig(app);
  const { server } = await createApolloServer(environment, httpServer);
  await server.start();

  configMiddleware(server, app);
  await new Promise<void>((resolve) => httpServer.listen({ port: config.port }, resolve));
  const targetUrl = `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
    server.graphqlPath
  }`;
  logger.log(`info`, `🚀 Server ready at ${targetUrl}`);

  const { proxyApp, proxyBasePath } = createProxyForTheApp(targetUrl);
  const proxyPort = process.env.PROXY_PORT;
  proxyApp.listen(proxyPort);
  logger.log(
    `info`,
    `proxy is listening on http://localhost:${proxyPort}${proxyBasePath}`
  );
}

startApolloServer({}, {});
