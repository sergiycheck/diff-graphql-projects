import PostService from './blog/post.service';
import UserService from './blog/user.service';

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ContextType = {
  userService: UserService;
  postsService: PostService;
};
