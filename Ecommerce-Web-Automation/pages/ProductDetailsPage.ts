import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailsPage models the page where a single product is viewed and added to cart.
 */
export class ProductDetailsPage extends BasePage {
    private readonly addToCartButton: Locator;

    constructor(page: Page, baseUrl: string) {
        super(page,baseUrl);
        this.addToCartButton = page.getByRole('main').getByRole('img', { name: 'Add', exact: true });
    }

    /**
     * Clicks the 'Add' button to put the current product into the cart
     */
    async addItemToCart(): Promise<void> {
        await this.addToCartButton.click();
        await this.page.waitForTimeout(500); 
    }
}
