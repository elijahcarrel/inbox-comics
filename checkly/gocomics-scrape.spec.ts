import { expect, test } from "@playwright/test";

const GOCOMICS_SYNDICATION_IDENTIFIER = "calvinandhobbes";

const SCRAPE_COMIC_MUTATION = `
  mutation ScrapeComic($identifier: String!) {
    scrapeComic(identifier: $identifier) {
      success
      imageUrl
      failureMode
      imageCaption
    }
  }
`;

test.setTimeout(120000);

test("scrapeComic returns success for a GoComics syndication", async ({
  request,
}) => {
  const domain = process.env.ENVIRONMENT_URL;
  if (domain == null || domain.length === 0) {
    throw new Error("ENVIRONMENT_URL must be set");
  }

  const response = await request.post(`${domain}/api/graphql`, {
    headers: { "Content-Type": "application/json" },
    data: {
      query: SCRAPE_COMIC_MUTATION,
      variables: { identifier: GOCOMICS_SYNDICATION_IDENTIFIER },
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.errors).toBeUndefined();

  const result = body.data?.scrapeComic;
  expect(result).toBeDefined();
  expect(result.success).toBe(true);
  expect(result.imageUrl).toBeTruthy();
  expect(result.failureMode).toBeNull();
});
