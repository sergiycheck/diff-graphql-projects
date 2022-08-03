import DataLoader from 'dataloader';
import { Post, User } from './blog/types';
import usersAuth from './blog/users-auth';

export type ContextType = {
  user?: User | undefined;
  usersAuth: typeof usersAuth;
  userBlogLoader: DataLoader<string, User, string>;
  postBlogLoader: DataLoader<string, Post, string>;
};
