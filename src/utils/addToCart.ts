import { Page } from "puppeteer";
import { ProductDetail } from "../types";

// Function to add product to cart
async function addToCart(page: Page, product: ProductDetail): Promise<void> {
  try {
    if (product.url) {
      // Navigate to the product page
      await page.goto(product.url, { timeout: 60000 });
      // Handle variations
      await page.$$eval(
        '[data-appears-component-name="variations"] select',
        (selects) => {
          selects.forEach((select) => {
            const secondOption = select.querySelector("option:nth-child(2)");
            if (secondOption) {
              (secondOption as HTMLOptionElement).selected = true; // Select the second option
              select.blur(); // Remove focus from select
            }
          });

          // Dispatch change event on all selects
          const changeEvent = new Event("change", { bubbles: true });
          selects.forEach((select) => {
            select.dispatchEvent(changeEvent);
          });
        }
      );
      // Handle personalization
      await page.$$eval(
        '[data-appears-component-name="personalization"] textarea',
        (elements) => {
          elements.forEach((element) => {
            (element as HTMLTextAreaElement).value = "Test";
            element.blur(); // Remove focus
          });
        }
      );

      try {
        // Wait for a brief period after selecting the options
        await page.evaluate(
          () => new Promise((resolve) => setTimeout(resolve, 1000))
        );
        // Wait for Add to cart button to appear
        await page.waitForSelector(
          '[data-selector="add-to-cart-button"] button',
          { timeout: 60000 }
        );

        // Click on the Add to cart button
        await page.click('[data-selector="add-to-cart-button"] button');

        // Wait for the loader to disappear
        await page.waitForSelector(".wt-spinner", {
          hidden: true,
          timeout: 60000,
        });

        // await page.waitForNavigation({ timeout: 60000 });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

export { addToCart };
