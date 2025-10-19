import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage models the view where the user reviews items and begins the checkout process.
 */
export class CartPage extends BasePage {

    private readonly checkoutLink: Locator;

    constructor(page: Page) {
        super(page);
        this.checkoutLink = this.page.locator('div.check-out.header-checkout a.btn.checkout.int-checkout');

    }

    /**
     * Clicks the main checkout button to start the checkout process
     */
    async proceedToCheckout(): Promise<void> {
        await this.checkoutLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.checkoutLink.click({ force: true });
        await this.checkoutLink.click({ force: true });

        await this.page.waitForURL(/.*checkout/);
    }
}
