import { User, Post } from './2_types';

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
    votes: 1,
    readByCurrentUser: true,
  },
  {
    id: '2',
    title: 'post2',
    userId: '1',
    votes: 1,
    readByCurrentUser: false,
  },
  {
    id: '3',
    title: 'post3',
    userId: '2',
    votes: 3,
    readByCurrentUser: false,
  },
  {
    id: '4',
    title: 'post4',
    userId: '1',
    votes: 3,
    readByCurrentUser: true,
  },
  {
    id: '5',
    title: 'post5',
    userId: '3',
    votes: 2,
    readByCurrentUser: true,
  },
  {
    id: '5',
    title: 'post5',
    userId: '2',
    votes: 0,
    readByCurrentUser: false,
  },
];
