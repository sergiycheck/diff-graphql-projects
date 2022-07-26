export type User = {
  id: string;
  email: string;
};

export type Post = {
  id: string;
  title: string;
  userId: string;

  votes: number;
  readByCurrentUser: boolean;
};

export type CreateUser = {
  email: string;
};

export type UpdateUser = Omit<User, 'email'> & { email?: string };

export type CreatePost = Omit<Post, 'id'>;

export type UpdatePost = Partial<Post> & Pick<Post, 'id'>;
