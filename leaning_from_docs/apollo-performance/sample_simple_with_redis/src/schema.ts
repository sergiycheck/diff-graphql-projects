import { CacheScope } from 'apollo-server-types';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLResolveInfo } from 'graphql';

type Book = {
  title: string;
  cachedTitle: string;
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
    book(title: String): Book
  }

  type Book @cacheControl(maxAge: 60, scope: PUBLIC) {
    title: String
    cachedTitle: String
  }
`;

const resolvers = {
  Query: {
    books: (_parent: any, _args: any, context: any, info: GraphQLResolveInfo) => {
      info.cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
      console.log('getting books', books);
      return books;
    },

    book: (
      _parent: any,
      args: { title: string },
      context: any,
      info: GraphQLResolveInfo
    ) => {
      const book = books.find((book) => book.title.includes(args.title));
      console.log('getting book', book);
      return book;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
