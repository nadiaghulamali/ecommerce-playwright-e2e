import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SearchResultsPage models interactions with the results overlay/page after searching.
 */
export class SearchResultsPage extends BasePage {
    // Locator for the entire search results container
    private readonly searchResultsContainer: Locator;

    constructor(page: Page, baseUrl: string) {
        super(page, baseUrl);
        this.searchResultsContainer = page.locator('#header-search-products-results');
    }

    /**
     * Clicks on a specific product link within the search results
     * @param productName The full visible name of the product link to click.
     */

    async addProductToCart(productName: string): Promise<void> {

        const product = this.page.locator('.product-container', { hasText: productName });
        await product.hover();
        const addButton = product.locator('xpath=following-sibling::div[contains(@class, "add-to-cart-bx")]//div[@class="js-add-product plus"]');
        await addButton.waitFor({ state: 'visible' });
        await addButton.click();

        console.log(`Successfully hovered over product: ${productName}. Cart controls should now be visible.`);
    }

    async selectProductFromResultList(productName: string): Promise<void> {

        await this.searchResultsContainer
            .getByRole('link', { name: productName })
            .click();

        // Wait for navigation to the Product Details Page
        await this.page.waitForLoadState('domcontentloaded');
    }
}
