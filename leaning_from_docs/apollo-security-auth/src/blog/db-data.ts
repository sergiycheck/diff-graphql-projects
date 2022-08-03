import bcrypt from 'bcrypt';
import { User, Post } from './types';

export const users: User[] = [
  {
    id: '1',
    email: 'user1@domain.com',
    password: 'user1_pass',
  },
  {
    id: '2',
    email: 'user2@domain.com',
    password: 'user2_pass',
  },
  {
    id: '3',
    email: 'user3@domain.com',
    password: 'user3_pass',
  },
  {
    id: '4',
    email: 'user4@domain.com',
    password: 'user4_pass',
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

export async function updateUsers() {
  return new Promise(async (resolve) => {
    const saltRounds = +process.env.SALT_ROUNDS;
    if (!saltRounds) throw new Error('Provide SALT_ROUNDS environment variable');

    for (let user of users) {
      try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPass = await bcrypt.hash(user.password, salt);
        user.password = hashPass;
      } catch (error) {
        throw new Error(
          `An error occurred while hashing users passwords. ${error.message}`
        );
      }
    }

    resolve(true);
  });
}
