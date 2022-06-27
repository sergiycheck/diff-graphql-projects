import { RESTDataSource } from 'apollo-datasource-rest';

class TodosAPI extends RESTDataSource {
  resourceName: string;

  constructor() {
    super();
    this.baseURL = 'http://localhost:3071/';
    this.resourceName = 'todos';
  }

  async getList() {
    return this.get(`${this.resourceName}`);
  }

  async getOne(id: string) {
    return this.get(`${this.resourceName}/${encodeURIComponent(id)}`);
  }

  async postOne(todo) {
    return this.post(`${this.resourceName}`, todo);
  }

  async updateOne(todo) {
    return this.patch(`${this.resourceName}/${encodeURIComponent(todo.id)}`, todo);
  }

  async deleteOne(id) {
    return this.delete(`${this.resourceName}/${encodeURIComponent(id)}`);
  }
}

export default TodosAPI;
