import { gql } from 'graphql-request';
import { createTestContext } from './__helpers';

const ctx = createTestContext();

describe('graphql-api tests', () => {
  it('ensures that a draft can be created and published', async () => {
    const draftResult = await ctx.client.request(gql`
      mutation {
        createDraft(title: "Nexus", body: "...") {
          id
          title
          body
          published
        }
      }
    `);

    // Snapshot that draft and expect `published` to be false
    expect(draftResult).toMatchInlineSnapshot(`
Object {
  "createDraft": Object {
    "body": "...",
    "id": 1,
    "published": false,
    "title": "Nexus",
  },
}
`);

    // Publish the previously created draft
    const publishResult = await ctx.client.request(
      gql`
        mutation publishDraft($draftId: Int!) {
          publish(draftId: $draftId) {
            id
            title
            body
            published
          }
        }
      `,
      { draftId: draftResult.createDraft.id },
    );

    // Snapshot the published draft and expect `published` to be true
    expect(publishResult).toMatchInlineSnapshot(`
Object {
  "publish": Object {
    "body": "...",
    "id": 1,
    "published": true,
    "title": "Nexus",
  },
}
`);

    const persistedData = await ctx.db.post.findMany();

    expect(persistedData).toMatchInlineSnapshot(`
Array [
  Object {
    "body": "...",
    "id": 1,
    "published": true,
    "title": "Nexus",
  },
]
`);
  });
});
