import { WithOptional } from 'src/common.types';
import { User } from './user.types';

export type Post = {
  id: string;
  title: string;
  user: User;
};

export type PostDb = Omit<Post, 'user'> & {
  userId: string;
};

export type CreatePost = Omit<Post, 'id' | 'user'> & {
  userId: string;
};

export type UpdatePost = WithOptional<Omit<Post, 'user'>, 'title'> & {
  userId: string;
};
