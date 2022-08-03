export type User = {
  id: string;
  email: string;
  password: string;
};

export type Token = {
  token: string;
};

export type Post = {
  id: string;
  title: string;
  userId: string;

  votes: number;
  readByCurrentUser: boolean;
};

export type CreateUser = Omit<User, 'id'>;

export type UpdateUser = Pick<User, 'id'> & { email?: string; password?: string };

export type CreatePost = Omit<Post, 'id'>;

export type UpdatePost = Partial<Post> & Pick<Post, 'id'>;
