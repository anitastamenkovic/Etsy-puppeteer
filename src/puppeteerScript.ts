const puppeteer = require("puppeteer");
const fs = require("fs");
const puppeteerExtra = require("puppeteer-extra");
const Stealth = require("puppeteer-extra-plugin-stealth");

import { Page, Browser } from "puppeteer";

import {
  extractProductDetail,
  extractProductInfo,
} from "./utils/extractProductInfo";
import { addToCart } from "./utils/addToCart";
import { simulateCheckout } from "./utils/checkout";
import { BasicProductDetails, ProductDetail } from "./types";

puppeteerExtra.use(Stealth());

(async () => {
  // Launch browser and open page. Use puppeteerExtra with Stealth to bypass ReCaptcha, but sometimes need to handle this manually
  const browser: Browser = await puppeteerExtra.launch({ headless: false }); // Change to headless: true for production
  const page: Page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  // Set User Agent also to bypass ReCaptcha
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );
  try {
    // Navigate to the Etsy website
    await page.goto("https://www.etsy.com", { timeout: 60000 });

    try {
      // Wait for the categories to be available
      await page.waitForSelector(".categories-grid", { timeout: 60000 });

      // Get the first link within the categories
      const firstLink = await page.$(".categories-grid a.wt-card__action-link");
      if (firstLink) {
        // Extract the href attribute value
        const href = await page.evaluate(
          (link) => link.getAttribute("href"),
          firstLink
        );
        if (href) {
          // Navigate to the extracted URL
          await page.goto(href, { timeout: 60000 });
        } else {
          console.error("No href attribute found on the link");
        }
      } else {
        console.error("No link found");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Basic Product Info Extraction
    const products = await extractProductInfo(page);

    // More Product Details Extraction
    const productsWithDetails: ProductDetail[] = [];
    for (const product of products) {
      const productDetail = await extractProductDetail(page, product);
      productsWithDetails.push(productDetail);
    }

    // Simulate Adding Products to Cart
    for (const product of productsWithDetails) {
      await addToCart(page, product);
    }

    // Checkout Simulation
    await simulateCheckout(page);

    // Store extracted data to local JSON file
    fs.writeFileSync(
      "etsyProducts.json",
      JSON.stringify(productsWithDetails, null, 2)
    );
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
})();
