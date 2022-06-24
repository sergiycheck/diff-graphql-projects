import { ApolloError } from 'apollo-server-errors';

export class MyError extends ApolloError {
  constructor(message: string) {
    super(message, 'MY_ERROR_CODE');

    Object.defineProperty(this, 'name', { value: 'MyError' });
  }
}
