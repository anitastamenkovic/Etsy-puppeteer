import { Page } from "puppeteer";
import { BasicProductDetails, ProductDetail } from "../types";

// Function to extract product information from the listing page
async function extractProductInfo(page: Page): Promise<BasicProductDetails[]> {
  try {
    const products = await page.$$eval("ol.wt-grid li", (productListItems) => {
      const visibleProductListItems = [];

      for (const item of productListItems) {
        const style = window.getComputedStyle(item);
        if (style && style.getPropertyValue("display") !== "none") {
          visibleProductListItems.push(item);
          if (visibleProductListItems.length === 10) break; // Break when 10 visible items are found
        }
      }

      return visibleProductListItems.map((item) => {
        const nameElement = item.querySelector("h2.wt-text-caption");
        const name = nameElement ? nameElement.textContent?.trim() : "";

        const priceElement = item.querySelector("span.currency-value");
        const price = priceElement ? priceElement.textContent?.trim() : "";

        const urlElement = item.querySelector("a.listing-link");
        const url = urlElement ? urlElement.getAttribute("href") : "";

        return { name, price, url };
      });
    });

    return products;
  } catch (error) {
    console.error("Error extracting product information:", error);
    return [];
  }
}

// Function to extract detailed information from the product detail page
async function extractProductDetail(
  page: Page,
  product: BasicProductDetails
): Promise<ProductDetail> {
  if (product.url) {
    try {
      await page.goto(product.url, { timeout: 60000 });

      const description = await page.$eval(
        "[data-product-details-description-text-content]",
        (element) => element.textContent?.trim() || ""
      );

      const variations = await page.$$eval(
        '[data-appears-component-name="variations"] select',
        (selects) => {
          const sizesArray: string[] = [];
          selects.forEach((select) => {
            const options = Array.from(select.querySelectorAll("option")).slice(
              1
            );
            options.forEach((option) => {
              const size = option.textContent?.trim();
              if (size) sizesArray.push(size);
            });
          });
          return sizesArray;
        }
      );

      const imageUrl = await page.$eval(
        ".listing-page-image-carousel-component img",
        (element) => element.getAttribute("src") || ""
      );

      return { ...product, description, variations, imageUrl };
    } catch (error) {
      console.error("Error extracting product details:", error);
      return { ...product, description: "", variations: [], imageUrl: "" };
    }
  } else {
    console.error("Error: Product URL not provided");
    return { ...product, description: "", variations: [], imageUrl: "" };
  }
}

export { extractProductDetail, extractProductInfo };
