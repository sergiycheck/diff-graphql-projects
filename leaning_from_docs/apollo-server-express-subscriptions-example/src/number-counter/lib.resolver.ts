import { withFilter } from 'graphql-subscriptions';
import { currentNumber } from './number-counter.emitter';
import pubsub from './pub-sub';

const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
    },
  },
};
export default resolvers;
