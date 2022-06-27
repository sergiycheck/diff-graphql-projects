import { ContextType } from '../types';

const resolver = {
  Query: {
    todos(parent, args, { dataSources }: ContextType, info) {
      return dataSources.todosApi.getList();
    },

    todo(_, args: { id: string }, { dataSources }: ContextType, info) {
      return dataSources.todosApi.getOne(args.id);
    },
  },

  Mutation: {
    createTodo(parent, args, { dataSources }: ContextType, info) {
      const { todo } = args;
      return dataSources.todosApi.postOne(todo);
    },
    updateTodo(parent, args, { dataSources }: ContextType, info) {
      const { todoPartial } = args;
      return dataSources.todosApi.updateOne(todoPartial);
    },
    deleteTodo(parent, args: { id: string }, { dataSources }: ContextType, info) {
      console.log('args', args);
      return dataSources.todosApi.deleteOne(args.id);
    },
  },
};

export default resolver;
