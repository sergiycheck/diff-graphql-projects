import { WithOptional } from 'src/common.types';
import { Post } from './post.types';

export type User = {
  id: string;
  email: string;
  posts: Post[];
};

export type CreatePostForUser = {
  title: string;
};

export type CreateUser = {
  email: string;
  posts?: CreatePostForUser[];
};

export type UpdateUser = WithOptional<Omit<User, 'posts'>, 'email'>;
