const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    "Get tracks array for homepage grid"
    tracksForHome: [Track!]!
  }

  type Track {
    id: ID!
    title: String!
    author: Author!
    thumbnail: String
    length: Int
    modulesCount: Int
  }

  type Author {
    id: ID!
    "Author's first and last name"
    name: String!
    "Author's profile picture url"
    photo: String
  }
`;

module.exports = typeDefs;

// const typeDefs = gql`
//   # write your schema definitions here
//   type Query {
//     spaceCats: [SpaceCat]
//   }

//   type SpaceCat {
//     id: ID!
//     name: String!
//     age: Int
//     missions: [Mission]
//   }

//   type Mission {
//     id: ID!
//     name: String!
//     description: String!
//   }
// `
