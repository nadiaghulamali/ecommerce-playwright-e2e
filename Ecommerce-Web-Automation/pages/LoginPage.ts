import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../data/TestData';

/**
 * Page Object for the Login and Authentication page.
 * It inherits universal methods and locators (like cartIcon and signInLink) from BasePage.
 */
export class LoginPage extends BasePage {

    // Login Form Elements
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInFormButton: Locator;

    // Error Message Elements
    private readonly errorMessage: Locator;
    private readonly fieldError: Locator;

   constructor(page: Page, baseURL?: string) {
        super(page, baseURL);

        this.emailInput = page.locator('#id_sidebar_login_username');
        this.passwordInput = page.locator('#id_sidebar_login_password');
        this.signInFormButton = page.getByRole('button', { name: 'Sign In' });
        this.errorMessage = page.locator('.alert-danger');
        this.fieldError = page.locator('.field-error');
    }

    /**
     * Logs a user into the application by filling out the form.
     * @param email The user's email address.
     * @param password The user's password.
     */

    async clickSignInbutton(): Promise<void> {

        await this.page.waitForTimeout(500);
        await this.signInLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.signInLink.click({ force: true });
    }
    async performLogin(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInFormButton.click();

        // Wait for potential page transition or network idle
        await this.page.waitForLoadState('networkidle');

        // Post-login validation: Wait for an element only visible when logged in (e.g., the header cart icon)
        // This confirms the login action has completed successfully.
        await expect(this.welcomeButton).toBeVisible({ timeout: 15000 });
    }

    /**
     * Verifies that the login failed and the expected error message is displayed.
     * @param expectedErrorMessage The specific error text to check for.
     */
    async verifyLoginFailure(expectedErrorMessage: string): Promise<void> {
        // Check for general error alert (e.g., incorrect credentials)
        let isGeneralError = await this.errorMessage.isVisible();

        if (isGeneralError) {
            await expect(this.errorMessage).toContainText(expectedErrorMessage);
        } else {
            // Check for field validation error (e.g., missing password)
            await expect(this.fieldError).toBeVisible();
            await expect(this.fieldError).toContainText(expectedErrorMessage);
        }
    }
}
