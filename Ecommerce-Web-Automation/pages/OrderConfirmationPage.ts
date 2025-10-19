import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * OrderConfirmationPage models the page displayed after a successful order submission.
 */
export class OrderConfirmationPage extends BasePage {
    private readonly thankYouHeader: Locator;
    private readonly referenceNumberHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.thankYouHeader = page.getByRole('heading', { name: 'Thank You For Your Order' }); // Line 44
        this.referenceNumberHeader = page.getByRole('heading', { name: 'Your order reference number is' }); // Line 43
    }

    /**
     * Asserts that the order confirmation page loads correctly.
     */
    async verifyOrderConfirmed(): Promise<void> {
        await this.thankYouHeader.waitFor({ state: 'visible' });
        await this.referenceNumberHeader.waitFor({ state: 'visible' });
    }
}
