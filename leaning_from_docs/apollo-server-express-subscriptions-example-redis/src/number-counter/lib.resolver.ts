import { withFilter } from 'graphql-subscriptions';
import { currentNumber, SOMETHING_CHANGED_TOPIC } from './number-counter.emitter';
import pubsub from './pub-sub';

const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
    somethingChanged: {
      subscribe: withFilter(
        (_, args: any) => {
          console.log('args', args);

          let res: any;
          if (args.relevantId) {
            res = pubsub.asyncIterator([`${SOMETHING_CHANGED_TOPIC}.${args.relevantId}`]);
          } else {
            res = pubsub.asyncIterator([SOMETHING_CHANGED_TOPIC]);
          }
          return res;
        },
        (payload, variables) => {
          console.log('payload', payload);
          console.log('variables', variables);

          return payload.somethingChanged.id === variables.relevantId;
        }
      ),
    },
  },
};
export default resolvers;

// TODO: can not properly understand how it works
// repository https://github.com/davidyaha/graphql-redis-subscriptions
