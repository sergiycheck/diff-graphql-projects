import DataLoader from 'dataloader';
import { ContextType } from 'src/types';

export type Domain = {
  id: string;
  name: string;
  expires: string;
  owner: string;
};

const domains: Domain[] = [
  {
    id: '1',
    name: 'user 1',
    expires: 'today',
    owner: 'Jamie',
  },
  {
    id: '2',
    name: 'graphql.eth',
    expires: 'tomorrow',
    owner: 'Jamie',
  },
];

const getDomainById = (id: string): Domain => {
  console.log(`Calling getDomainById for id: ${id}`);

  const domain = domains.find((d) => d.id === id);
  if (!domain) throw new Error(`domain not found. id: ${id}`);
  return domain;
};

export const getDomainByIds = async (ids: readonly string[]): Promise<Domain[]> => {
  return ids.map((id) => getDomainById(id));
};

const resolver = {
  Query: {
    domain: (_parent, { id }) => ({ id }),
    domains: () => domains.map((domain) => ({ id: domain.id })),
  },
  Domain: {
    name: async ({ id }, _, context: ContextType) => {
      const { domainLoader } = context;
      const { name } = await domainLoader.load(id);

      return name;
    },
    expires: async ({ id }, _, context: ContextType) => {
      const { domainLoader } = context;

      const { expires } = await domainLoader.load(id);

      return expires;
    },
    owner: async ({ id }, _, context: ContextType) => {
      const { domainLoader } = context;

      const { owner } = await domainLoader.load(id);

      return owner;
    },
  },
};

export const domainLoader = new DataLoader(getDomainByIds);

export default resolver;
