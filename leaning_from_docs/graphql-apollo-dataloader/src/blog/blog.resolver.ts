import { ContextType } from './../types';
export type User = {
  id: string;
  email: string;
};

export type Post = {
  id: string;
  title: string;
  userId: string;
};

const users: User[] = [
  {
    id: '1',
    email: 'user1@domain.com',
  },
  {
    id: '2',
    email: 'user2@domain.com',
  },
  {
    id: '3',
    email: 'user3@domain.com',
  },
  {
    id: '4',
    email: 'user4@domain.com',
  },
];

const posts: Post[] = [
  {
    id: '1',
    title: 'post1',
    userId: '1',
  },
  {
    id: '2',
    title: 'post2',
    userId: '1',
  },
  {
    id: '3',
    title: 'post3',
    userId: '2',
  },
  {
    id: '4',
    title: 'post4',
    userId: '1',
  },
  {
    id: '5',
    title: 'post5',
    userId: '3',
  },
  {
    id: '5',
    title: 'post5',
    userId: '2',
  },
];

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

const resolver = {
  Query: {
    allUsers(_parent, _args, context: ContextType, info) {
      const usersFromDb = users;
      return usersFromDb.map((u) => context.userBlogLoader.load(u.id));
    },

    user(_parent, args: { id: string }, context: ContextType, info) {
      return context.userBlogLoader.load(args.id);
    },

    allPosts(_parent, _args, context: ContextType, info) {
      return posts.map((p) => context.postBlogLoader.load(p.id));
    },

    post(_parent, args: { id: string }, context: ContextType, info) {
      return context.postBlogLoader.load(args.id);
    },
  },

  User: {
    posts(parent: User, _args, context: ContextType, info) {
      console.log('User posts parent', parent);
      return posts.filter((p) => p.userId === parent.id);
    },
  },
  Post: {
    user(parent: Post, _args, context: ContextType, info) {
      console.log('Post user parent', parent);
      return context.userBlogLoader.load(parent.userId);
    },
  },

  // Mutation: {
  //   createUser(parent, args, context: ContextType, info) {
  //     const { dto }: { dto: CreateUser } = args;
  //     return context.userService.createOne(dto);
  //   },
  //   updateUser(parent, args, context: ContextType, info) {
  //     const { dto }: { dto: UpdateUser } = args;
  //     return context.userService.updateOne(dto);
  //   },
  //   deleteUser(parent, args: { id: string }, context: ContextType, info) {
  //     return context.userService.deleteOne(args.id);
  //   },

  //   createPost(parent, args, context: ContextType, info) {
  //     const { dto }: { dto: CreatePost } = args;
  //     return context.postsService.createOne(dto);
  //   },
  //   updatePost(parent, args, context: ContextType, info) {
  //     const { dto }: { dto: UpdatePost } = args;
  //     return context.postsService.updateOne(dto);
  //   },
  //   deletePost(parent, args: { id: string }, context: ContextType, info) {
  //     return context.postsService.deleteOne(args.id);
  //   },
  // },
};

export default resolver;
