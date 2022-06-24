const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    tracksForHome: [Track!]!
  }

  "A track is a group of Modules that teaches about a specific topic"
  type Track {
    id: ID!
    thumbnail: String
    topic: String
    title: String!
    description: String
    numberOfViews: Int
    createdAt: String
    length: Int
    modulesCount: Int

    modules: [String]
    # get author from authorId
    author: Author!
  }

  "Author of a complete Track or a Module"
  type Author {
    id: ID!
    name: String!
    photo: String
  }
`;

module.exports = typeDefs;
