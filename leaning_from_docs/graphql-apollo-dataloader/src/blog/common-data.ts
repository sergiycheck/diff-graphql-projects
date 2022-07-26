// import { users, posts } from './1_db-data';
import { users, posts } from './2_db-data';
import { User, Post } from './1_types';

export const getUserById = (id: string): User => {
  console.log(`Calling getUserById for id: ${id}`);

  return users.find((d) => d.id === id);
};
export const getUsersByIds = async (ids: readonly string[]): Promise<User[]> => {
  return ids.map((id) => getUserById(id));
};

export const getPostById = (id: string): Post => {
  console.log(`Calling getPostById for id: ${id}`);

  return posts.find((d) => d.id === id);
};

export const getPostsByIds = async (ids: readonly string[]): Promise<Post[]> => {
  return ids.map((id) => getPostById(id));
};
