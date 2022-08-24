import express from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { logger } from './utils/logger';

export function logProvider(provider) {
  const myCustomProvider = {
    log: logger.log.bind(logger),
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
  };

  return myCustomProvider;
}

export type ProxyApp = {
  proxyApp: ReturnType<typeof express>;
  proxyBasePath: string;
};

export default function createProxyForTheApp(targetUrl: string): ProxyApp {
  const proxyApp = express();
  const proxyBasePath = '/graphql-api';

  proxyApp.use(
    proxyBasePath,
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      ws: true,
      logProvider,
      selfHandleResponse: true,
      onError(err, req, res, target) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
      },
      onProxyReq(proxyReq, req, res) {
        logger.log(`info`, `[${req.method}]: ${req.path}`);
        proxyReq.setHeader('x-added', 'foobar');
      },
      onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        proxyRes.headers['x-added'] = 'foobar';
        delete proxyRes.headers['x-removed'];

        if (proxyRes.headers['content-type'].startsWith('application/json')) {
          let data = JSON.parse(responseBuffer.toString('utf8'));

          data = Object.assign({}, data, { extra: 'foo bar' });

          return JSON.stringify(data);
        }

        // return other content-types as-is
        return responseBuffer;
      }),
      onProxyReqWs(proxyReq, req, socket, options, head) {
        // add custom header
        proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
      },
    })
  );

  return { proxyApp, proxyBasePath };
}
