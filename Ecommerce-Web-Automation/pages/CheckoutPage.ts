import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { PaymentMethod } from '../data/TestData';

/**
 * CheckoutPage models the entire checkout funnel.
 */
export class CheckoutPage extends BasePage {

    private readonly paymentMethodLink: Locator;
    private readonly cashOnDeliveryOption: Locator;
    private readonly continueButton: Locator;
    private readonly placeOrderButton: Locator;
    private readonly substituteItemsLink: Locator;
    private readonly firstSubstitutionOption: Locator;
    private readonly dayTabsContainer: Locator;

    // Delivery Time Step Locators 
    private readonly chooseDeliveryTimeLink: Locator;
    private readonly firstAvailableTimeSlot: Locator;

    constructor(page: Page) {
        super(page);
        this.paymentMethodLink = page.getByRole('link', { name: 'Payment Method Please select' });
        this.cashOnDeliveryOption = page.locator('div').filter({ hasText: PaymentMethod.COD }).nth(5);
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.substituteItemsLink = this.page.getByRole('link', { name: /Substitute Items/i });
        this.firstSubstitutionOption = page.locator('.c-options.js-c-options-subs').first();
        this.dayTabsContainer = page.locator('.delivery-dates');
        this.chooseDeliveryTimeLink = this.page.locator('.choose-deliveryTime');
        this.firstAvailableTimeSlot = page.locator('label.time-choice:not(.unavailable-slot)').first();
    }

    /**
     * Completes the payment step by selecting Cash on Delivery.
     */
    async selectPaymentMethod(): Promise<void> {
        await this.paymentMethodLink.click();
        await this.cashOnDeliveryOption.click();
        await this.continueButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async handleSubstitution(): Promise<void> {

        await this.substituteItemsLink.click();

        await this.firstSubstitutionOption.click();

        await this.continueButton.click(); // Line 33
        await this.page.waitForLoadState('networkidle');
    }


    async selectDeliveryTimeSlot(): Promise<void> {
        await this.chooseDeliveryTimeLink.click();
        await this.firstAvailableTimeSlot.click();
    }

    async confirmPlaceOrder(): Promise<void> {
        await this.placeOrderButton.click();
        await this.page.waitForURL(/thank-you/);
    }
}
