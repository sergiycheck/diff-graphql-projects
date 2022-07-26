import { User, Post } from './common-data';

export const users: User[] = [
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

export const posts: Post[] = [
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
