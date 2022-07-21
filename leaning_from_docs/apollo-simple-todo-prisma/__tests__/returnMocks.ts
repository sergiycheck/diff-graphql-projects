export const users: Array<any> = [
  { id: '62d6a5c956abfd7a4a49ca02', email: 'userChanged3@domain.com' },
  { id: '62d6b0796c3bd6afed89cd6a', email: 'user1@domain.com' },
];

export const postArrFirst: Array<any> = [
  {
    id: '62d6a5ca56abfd7a4a49ca04',
    title: 'title 2 changed',
    userId: '62d6a5c956abfd7a4a49ca02',
  },
];

export const postArrSecondAndThird: Array<any> = [
  {
    id: '62d6bde29b774b5b0e1807d3',
    title: 'post from user 1',
    userId: '62d6b0796c3bd6afed89cd6a',
  },
  {
    id: '62d7de56769f78f5db757dee',
    title: 'title of the post 3',
    userId: '62d6b0796c3bd6afed89cd6a',
  },
];

export const createUser_Mutation = {
  dto: {
    email: 'testUser1@domain.com',
    posts: [
      {
        title: 'test post 1',
      },
    ],
  },
  res: {
    data: {
      createUser: {
        id: '62d943e4d26034228f911fd6',
        email: 'testEm',
        posts: [
          {
            id: '62d943e4d26034228f911fd7',
            title: 'test title 1',
          },
        ],
      },
    },
  },
};
