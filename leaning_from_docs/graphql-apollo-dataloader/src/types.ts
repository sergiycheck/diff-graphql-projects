import DataLoader from 'dataloader';
import { Post, User } from './blog/blog.resolver';
import { Domain } from './domains/domain.resolver';
import { UserSocial } from './users/users.resolver';

export type ContextType = {
  userSocialLoader: DataLoader<string, UserSocial, string>;
  domainLoader: DataLoader<string, Domain, string>;

  userBlogLoader: DataLoader<string, User, string>;
  postBlogLoader: DataLoader<string, Post, string>;
};
