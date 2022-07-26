import { makeExecutableSchema } from '@graphql-tools/schema';
import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { GraphQLSchema, GraphQLResolveInfo } from 'graphql';

type Book = {
  title: string;
  cachedTitle: string;
};

type Reader = {
  book: Book;
};

const books: Book[] = [
  { title: 'book title 1', cachedTitle: 'cached title 1' },
  { title: 'book title 2', cachedTitle: 'cached title 2' },
  { title: 'book title 3', cachedTitle: 'cached title 3' },
];

const typeDefs = /* GraphQL */ `
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  type Query {
    books: [Book]
    book: Book
    cachedBook: Book @cacheControl(maxAge: 60)
    reader: Reader @cacheControl(maxAge: 40)
  }

  # Error unknown directive "@key"
  # type Book @key(fields: "isbn") @cacheControl(maxAge: 30) {
  #   isbn: String!
  #   title: String
  # }

  type Book {
    title: String
    cachedTitle: String @cacheControl(maxAge: 30)
  }

  type Reader {
    book: Book @cacheControl(inheritMaxAge: true)
  }
`;

const resolvers = {
  Query: {
    books: (_parent: any, _args: any, context: any, info: GraphQLResolveInfo) => books,

    book: (_parent: any, _args: any, context: any, info: GraphQLResolveInfo) => {
      const [first] = books;
      return first;
    },

    cachedBook: (_parent: any, _args: any, context: any, info: GraphQLResolveInfo) => {
      const cachedBook: Book = {
        title: 'cached book title 1',
        cachedTitle: 'cached title for cached book',
      };

      return cachedBook;
    },

    reader: (_parent: any, _args: any, context: any, info: GraphQLResolveInfo) => {
      const [_, second] = books;
      const reader: Reader = {
        book: second,
      };

      return reader;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startApolloServer(schema: GraphQLSchema) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
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

startApolloServer(schema);
