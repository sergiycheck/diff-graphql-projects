const libraries = [
  {
    branch: 'downtown',
  },
  {
    branch: 'riverside',
  },
];

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown',
  },
];

// Resolver map
const resolvers = {
  Query: {
    libraries() {
      // Return our hardcoded array of libraries
      return libraries;
    },
  },
  Library: {
    books(parent) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return books.filter((book) => book.branch === parent.branch);
    },
  },
  Book: {
    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent) {
      return {
        name: parent.author,
      };
    },
  },

  // Because Book.author returns an object with a "name" field,
  // Apollo Server's default resolver for Author.name will work.
  // We don't need to define one.
};

export default resolvers;
