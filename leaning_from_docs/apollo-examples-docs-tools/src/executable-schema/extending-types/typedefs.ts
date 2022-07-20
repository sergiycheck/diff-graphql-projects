const typeDefs = [
  /* GraphQL */ `
  schema {
    query: Query
  }

  type Query {
    bars: [Bar]!
  }

  type Bar {
    id
  }
  `,
  /* GraphQL */ `
    type Foo {
      id: String!
    }

    extend type Query {
      foos: [Foo]!
    }
  `,
];
