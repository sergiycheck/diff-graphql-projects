import TodosAPI from './todos/todo.datasource';

export type DataSources = {
  todosApi: TodosAPI;
};

export type ContextType = {
  dataSources: DataSources;
};
