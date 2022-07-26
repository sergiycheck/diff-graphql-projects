import { ApolloServer } from 'apollo-server';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginCacheControlDisabled,
} from 'apollo-server-core';

let server: ApolloServer;

const forEachOperationResponse = process.env.ForEachOp;
const entirely = process.env.Entirely;
// cache control plugin still calculates caching behavior for each
//operation response

if (forEachOperationResponse) {
  server = new ApolloServer({
    // ...other options...
    plugins: [ApolloServerPluginCacheControl({ calculateHttpHeaders: false })],
  });
} else if (entirely) {
  // or disable cache control calculation entirely

  server = new ApolloServer({
    // ...other options...
    plugins: [ApolloServerPluginCacheControlDisabled()],
  });
}
