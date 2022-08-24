import { logger } from './../utils/logger';
// import { users, posts } from './1_db-data';
import { users, posts } from './db-data';
import { User, Post } from './types';

export const getUserById = (id: string): User => {
  logger.log(`info`, `Calling getUserById for id: ${id}`);

  return users.find((d) => d.id === id);
};
export const getUsersByIds = async (ids: readonly string[]): Promise<User[]> => {
  return ids.map((id) => getUserById(id));
};

export const getPostById = (id: string): Post => {
  logger.log(`info`, `Calling getPostById for id: ${id}`);

  return posts.find((d) => d.id === id);
};

export const getPostsByIds = async (ids: readonly string[]): Promise<Post[]> => {
  return ids.map((id) => getPostById(id));
};
