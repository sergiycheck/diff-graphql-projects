import { withFilter } from 'graphql-subscriptions';
import pubsub from './pub-sub';

const resolvers = {
  Subscription: {
    hello: {
      // Example using an async generator
      subscribe: async function* () {
        for await (const word of ['Hello', 'Bonjour', 'Ciao']) {
          yield { hello: word };
        }
      },
    },

    postCreated: {
      subscribe: () => {
        pubsub.asyncIterator(['POST_CREATED']);

        pubsub.publish('POST_CREATED', {
          postCreated: {
            author: 'Ali Baba',
            comment: 'Open sesame',
          },
        });
      },
    },

    commentAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('COMMENT_ADDED'),
        (payload, variables) => {
          // Only push an update if the comment is on
          // the correct repository for this operation
          return payload.commentAdded.repository_name === variables.repoFullName;
        }
      ),
    },
  },

  Mutation: {
    createPost(parent, args, context) {
      pubsub.publish('POST_CREATED', { postCreated: args });
      // return postController.createPost(args);
    },
  },
};

export default resolvers;
