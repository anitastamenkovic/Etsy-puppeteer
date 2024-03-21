import { Page } from "puppeteer";

// Function to simulate checkout process
async function simulateCheckout(page: Page): Promise<void> {
  try {
    // Wait for the link for adding to cart to appear
    await page.waitForSelector("[data-header-cart-button] a", {
      timeout: 60000,
    });

    // Click on the link
    const cardLink = await page.$("[data-header-cart-button] a");
    if (cardLink) {
      const href = await page.evaluate(
        (el) => el.getAttribute("href"),
        cardLink
      );
      if (href) {
        // Navigate to the page specified by the href attribute
        await page.goto(href);
      } else {
        console.error("Error: href attribute not found for the card link");
      }
    } else {
      console.error("Error: Link for adding to cart not found");
    }

    // Wait for button to appear lick on the button to proceed to checkout
    await page.waitForSelector(".proceed-to-checkout", { timeout: 60000 });
    await page.click(".proceed-to-checkout");

    // Wait for the validation div to appear and click on the button to proceed as a guest
    await page.waitForSelector('button[name="submit_attempt"]', {
      timeout: 60000,
    });
    await page.click('button[name="submit_attempt"]');
    await page.waitForNavigation({ timeout: 60000 });

    // Wait for inputs to appear and enter test data into the inputs
    await page.waitForSelector('input[name="email_address"]', {
      timeout: 60000,
    });
    await page.type('input[name="email_address"]', "test@test.com");

    await page.waitForSelector('input[name="email_address_confirmation"]', {
      timeout: 60000,
    });
    await page.type(
      'input[name="email_address_confirmation"]',
      "test@test.com"
    );

    await page.waitForSelector('input[name="name"]', { timeout: 60000 });
    await page.type('input[name="name"]', "Anita Stamenkovic");

    await page.waitForSelector('input[name="first_line"]', { timeout: 60000 });
    await page.type('input[name="first_line"]', "Some street");

    await page.waitForSelector('input[name="city"]', { timeout: 60000 });
    await page.type('input[name="city"]', "Nis");

    // Click on the button to save data and proceed to payment part
    await page.waitForSelector("[data-selector-save-btn]", { timeout: 60000 });
    await page.click("[data-selector-save-btn]");
    await page.waitForNavigation({ timeout: 60000 });
  } catch (error) {
    console.error("Error filling checkout form:", error);
  }
}

export { simulateCheckout };
