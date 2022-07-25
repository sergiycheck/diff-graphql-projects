import 'reflect-metadata';
import { ContextType } from './../src/common.types';
import { prismaInstance } from './../src/constants';
import { Container } from 'typedi';
import { ApolloServer } from 'apollo-server';
import { loadFiles } from '@graphql-tools/load-files';
import UserService from '../src/blog/user.service';
import PostService from '../src/blog/post.service';
import {
  users,
  postArrFirst,
  postArrSecondAndThird,
  createUser_Mutation,
} from './returnMocks';
import { CreateUser } from '../src/blog/user.types';

function getPrismaFake() {
  const commonMethods = {
    findMany: (obj: any) => {},
    findUnique: function (obj: any) {},
    create: (obj: any) => {},
    update: (obj: any) => {},
    delete: (obj: any) => {},
  };
  type CommonMethodsType = typeof commonMethods | {} | any;
  const user: CommonMethodsType = {};
  const post: CommonMethodsType = {};
  Object.assign(user, commonMethods);
  Object.assign(post, commonMethods);
  const prismaFake = {
    user,
    post,
  };
  return prismaFake;
}

describe('index requests tests', () => {
  let testServer: ApolloServer;
  let prismaMock: ReturnType<typeof getPrismaFake>;

  beforeAll(async () => {
    prismaMock = getPrismaFake();

    Container.set(prismaInstance, prismaMock);

    const context: ContextType = {
      userService: Container.get(UserService),
      postsService: Container.get(PostService),
    };

    const typeDefs = await loadFiles('./src/**/*.{gql, graphql}');
    const resolvers = await loadFiles('./src/**/*.resolver.ts');

    testServer = new ApolloServer({
      typeDefs,
      resolvers,
      context,
    });
  });

  test('returns allUsers', async () => {
    const findManyMock = jest
      .spyOn(prismaMock.user, 'findMany')
      .mockImplementation(() => {
        const [firstUser, secondUser] = users;

        const result = [
          {
            ...firstUser,
            posts: [...postArrFirst],
          },
          {
            ...secondUser,
            posts: [...postArrSecondAndThird],
          },
        ];

        return result;
      });

    const [mockFirst, mockSecond] = users;
    const { userId, ...expectedData } = postArrFirst[0];

    const result = await testServer.executeOperation({
      query: /* GraphQL */ `
        query AllUsers {
          allUsers {
            id
            email
            posts {
              id
              title
            }
          }
        }
      `,
    });

    expect(findManyMock).toHaveBeenCalled();

    expect(result.errors).toBeUndefined();

    const [first, second] = result.data?.allUsers as Array<any>;

    const [firstPost] = first.posts;

    expect(first.id).toBe(mockFirst.id);

    expect(firstPost).toEqual(expectedData);

    findManyMock.mockClear();
  });

  test('return user by id', async () => {
    const [firstUser] = users;

    const resultUser = {
      ...firstUser,
      posts: [...postArrFirst],
    };

    const findUniqueMock = jest
      .spyOn(prismaMock.user, 'findUnique')
      .mockReturnValueOnce(resultUser);

    const userId = '62d6a5c956abfd7a4a49ca02';
    const result = await testServer.executeOperation({
      query: /* GraphQL */ `
        query Query($userId: String!) {
          user(id: $userId) {
            id
            email
            posts {
              id
              title
            }
          }
        }
      `,
      variables: {
        userId,
      },
    });

    expect(findUniqueMock).toHaveBeenCalled();
    expect(result.errors).toBeUndefined();

    const user = result.data?.user;
    expect(user.id).toBe(userId);
    expect(user.email).toBeDefined();
    expect(user.posts[0].id).toBe(postArrFirst[0].id);

    findUniqueMock.mockClear();
  });

  test('returns allPosts', async () => {
    const findManyMock = jest
      .spyOn(prismaMock.post, 'findMany')
      .mockImplementation(() => {
        const [firstUser, secondUser] = users;

        const [firstPost] = postArrFirst;
        const { userId, ...postData } = firstPost;

        postArrSecondAndThird.forEach((p) => {
          delete p.userId;
          return p;
        });
        const [secondPost, thirdPost] = postArrSecondAndThird;

        const result = [
          {
            ...firstPost,
            user: {
              ...firstUser,
            },
          },
          {
            ...secondPost,
            user: {
              ...secondUser,
            },
          },
          {
            ...thirdPost,
            user: {
              ...secondUser,
            },
          },
        ];

        return result;
      });

    const numberOfPosts = 3;

    const [userFirst, userSecond] = users;

    const result = await testServer.executeOperation({
      query: /* GraphQL */ `
        query AllPosts {
          allPosts {
            id
            title
            user {
              id
              email
            }
          }
        }
      `,
    });

    expect(findManyMock).toHaveBeenCalled();

    expect(result.errors).toBeUndefined();
    expect(result.data?.allPosts.length).toBe(numberOfPosts);
    const [first, second] = result.data?.allPosts as Array<any>;

    expect(first.id).toBe(postArrFirst[0].id);

    expect(first.user).toEqual(userFirst);
    expect(second.user).toEqual(userSecond);

    findManyMock.mockClear();
  });

  test('mutation createUser', async () => {
    const { res, dto } = createUser_Mutation;

    const createUserMock = jest
      .spyOn(prismaMock.user, 'create')
      .mockReturnValueOnce(res.data.createUser);

    const returnValue = {
      posts: function (obj: any) {
        return {};
      },
    };

    jest.spyOn(returnValue, 'posts').mockReturnValueOnce(res.data.createUser.posts);

    const result = await testServer.executeOperation({
      query: /* GraphQL */ `
        mutation Mutation($dto: CreateUser!) {
          createUser(dto: $dto) {
            id
            email
            posts {
              id
              title
            }
          }
        }
      `,
      variables: {
        dto,
      },
    });

    expect(createUserMock).toHaveBeenCalled();

    const actualUser = result.data?.createUser;

    expect(actualUser).toEqual(res.data.createUser);

    createUserMock.mockClear();
  });

  // test('mutation createUser', async () => {

  // })
});
