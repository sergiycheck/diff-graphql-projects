import { CacheScope } from 'apollo-server-types';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLResolveInfo } from 'graphql';

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

// middlewares is available with graphql modules
async function middleware({ root, args, context, info }, next) {
  /* code */

  const result = await next();

  return result;
}

// TODO: can not see cached fields in
// redis keys
const resolvers = {
  Query: {
    books: (_parent: any, _args: any, context: any, info: GraphQLResolveInfo) => books,

    book: (_parent: any, _args: any, context: any, info: GraphQLResolveInfo) => {
      info.cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Public });
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
export default schema;
