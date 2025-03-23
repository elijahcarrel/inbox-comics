// eslint-disable-next-line @typescript-eslint/no-require-imports
const { expect, test } = require("@playwright/test");

test.setTimeout(210000);
test.use({ actionTimeout: 10000 });

test("wait for the continue button to become visible", async ({ page }) => {
  const domain = process.env.ENVIRONMENT_URL;
  await page.goto(`${domain}/user/new`);

  const proceedButton = page.getByText("Continue Without Selecting Comics");
  await expect(proceedButton).toBeVisible();
});
