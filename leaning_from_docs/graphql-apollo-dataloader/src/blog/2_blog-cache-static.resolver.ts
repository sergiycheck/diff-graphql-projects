import { ContextType } from './../types';
import { users, posts } from './2_db-data';
import { CreatePost, CreateUser, Post, UpdatePost, UpdateUser, User } from './2_types';

// TODO: know how caching works
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

  Mutation: {
    createUser(parent, args, context: ContextType, info) {
      const { dto }: { dto: CreateUser } = args;

      const newUser: User = {
        id: `${Number(users[users.length - 1].id) + 1}`,
        ...dto,
      };

      users.push(newUser);

      return newUser;
    },
    updateUser(parent, args, context: ContextType, info) {
      const { dto }: { dto: UpdateUser } = args;
      const userToUpdate = users.find((u) => u.id === dto.id);

      if (!userToUpdate) throw new Error(`user was not found`);

      userToUpdate.email = dto.email;

      return userToUpdate;
    },
    deleteUser(parent, args: { id: string }, context: ContextType, info) {
      const user = users.find((u) => u.id === args.id);

      if (!user) throw new Error(`user was not found`);

      users.splice(users.indexOf(user), 1);

      return user;
    },

    createPost(parent, args, context: ContextType, info) {
      const { dto }: { dto: CreatePost } = args;

      const newItem: Post = {
        id: `${Number(posts[posts.length - 1].id) + 1}`,
        ...dto,
      };

      posts.push(newItem);

      return newItem;
    },
    updatePost(parent, args, context: ContextType, info) {
      const { dto }: { dto: UpdatePost } = args;

      const { id, ...update } = dto;
      let itemToUpdate = posts.find((u) => u.id === id);

      if (!itemToUpdate) throw new Error(`post was not found`);

      posts[posts.indexOf(itemToUpdate)] = {
        ...itemToUpdate,
        ...update,
      };

      return itemToUpdate;
    },
    deletePost(parent, args: { id: string }, context: ContextType, info) {
      const post = posts.find((u) => u.id === args.id);

      if (!post) throw new Error(`post was not found`);

      posts.splice(posts.indexOf(post), 1);

      return post;
    },
  },
};

export default resolver;
