# Puppeteer Etsy Scraper

This project is a web scraper built with Puppeteer to extract product information from Etsy. It automates the process of navigating through the website, extracting product details, adding products to the cart, and simulating the checkout process.
The scraper will launch a headless browser, navigate to the Etsy website, extract product information, and save it to a local JSON file named `etsyProducts.json`.

## Features

- Extracts basic product information such as name, price, and URL.
- Retrieves more detailed product information including description, variations, and image URL.
- Simulates adding products to the cart and proceeding through the checkout process.
- Stores extracted data in a local JSON file.

## Installation

To use this scraper, follow these steps:

1. Clone the repository to your local machine:

```bash
   git clone https://github.com/your-username/puppeteer-etsy-scraper.git
```

2. Navigate to the project directory:

```bash
   cd puppeteer-etsy-scraper
```

3. Install the dependencies using npm:

```bash
   npm install
```

## Usage

To run the scraper, follow these steps:

1. Build the project:

```bash
   npm run build
```

2. Start the scraper:

```bash
   npm run start
```

### Assumptions and decisions

I included puppeteerExtra with Stealth to bypass ReCaptcha but sometimes the scraper may encounter challenges, which require manual intervention. In such cases, you need to handle them manually.

When considering the first two features of the scraper, which are:

1. Extracts basic product information such as name, price, and URL.
2. Retrieves more detailed product information including description, variations, and image URL.

I deliberated on the approach to take. One option was to solely gather the URL in the initial step and collect all other information in a subsequent stage. However, I opted for the second choice without a specific reason (maybe save time). This decision led to gathering as much information as possible initially, followed by the collection of additional details in the second feature.

While contemplating the process of adding products to the cart, I pondered whether it might be more efficient to integrate this step with the information collection phase. This approach would avoid revisiting the same page multiple times. However, I ultimately decided to keep this feature separate within the project. This decision was made to maintain modularity and ensure clarity within the project structure.

In contemplating the project workflow, I considered integrating the "simulate checkout" step directly after adding products to the cart. However, I encountered occasional issues with navigating to the checkout page from the product page, which influenced my decision to maintain this step as a separate process. By keeping it distinct, I ensure smoother execution and greater flexibility in handling potential navigation issues.

## Overcoming Challenges and Implementing Solutions

During the development process, I encountered several challenges related to button clicking, navigation, and element selection. To address these issues, I experimented with various approaches, including:

1. **Waiting for Elements:** Utilizing wait functions to ensure the required elements appear before interacting with them.
2. **Click Functionality:** Employing regular click features to trigger actions such as adding items to the cart.
3. **Evaluate Method:** Using the evaluate method to execute JavaScript code within the page context for dynamic interactions.
4. **Navigation Handling:** Managing navigation issues by implementing strategies like waiting for navigation events to complete successfully.

Additionally, I encountered issues with select elements retaining focus and premature button clicking. To mitigate these issues, I implemented the following solutions:

- **Blur Mechanism:** Removing focus from select elements after interaction to prevent premature clicks.
- **Adding Wait Time:** Introducing a delay to ensure all necessary actions, such as selecting options, complete before clicking the button.

Furthermore, beyond variations, certain products required additional input, such as personalization details. To accommodate this, I extended the functionality to handle such scenarios effectively.
