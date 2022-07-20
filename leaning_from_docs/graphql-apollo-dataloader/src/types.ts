import { userLoader } from './users/users.resolver';
import { domainLoader } from './domains/domain.resolver';

export type ContextType = {
  userLoader: typeof userLoader;
  domainLoader: typeof domainLoader;
};
