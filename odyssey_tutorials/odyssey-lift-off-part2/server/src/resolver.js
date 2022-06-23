const resolvers = {
  Query: {
    // returns an array of Tracks that will be used to populate
    // the homepage grid of our web client
    tracksForHome: (parent, args, context, info) => {
      const { dataSources } = context;
      const res = dataSources.trackAPI.getTracksForHome();
      return res;
    },
  },
  Track: {
    author: (parent, args, context, info) => {
      const { dataSources } = context;
      // The parent argument contains data returned by our
      //tracksForHome resolver
      const { authorId } = parent;
      const res = dataSources.trackAPI.getAuthor(authorId);
      return res;
    },
  },
};

module.exports = resolvers;
