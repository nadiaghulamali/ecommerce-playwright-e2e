import { Page, Locator } from '@playwright/test';

/**
 * The BasePage serves as the parent class for all Page Object Models (POMs).
 * It holds common utility methods and shared Locators.
 */
export class BasePage {

    protected readonly page: Page;
    protected readonly baseURL: string;

    public readonly welcomeButton: Locator;
    private readonly cookieAcceptButton: Locator;
    public readonly cartHeaderLink: Locator;
    public readonly searchInput: Locator;
    public readonly logoutLink: Locator;
    public readonly signInLink: Locator;
    public readonly cartIcon: Locator;

    /**
     * Initializes the BasePage.
     * @param page The Playwright Page object.
     * @param baseUrl The base URL provided by the test environment (optional).
     */
    // NOTE: We no longer provide a hardcoded default here.
    // We rely on Playwright to pass its configured baseURL, or we fail if it's missing.
   constructor(page: Page, baseURL?: string) {
        this.page = page;
        // Use provided baseURL or fallback
        this.baseURL = baseURL || 'https://www.choithrams.com';

        // Initialize common locators using descriptive methods
        this.welcomeButton = page.getByText('Welcome', { exact: true });;
        this.signInLink = page.locator('.js-siginin', { hasText: 'Sign in' }).nth(0);
        this.cookieAcceptButton = page.getByRole('button', { name: 'Accept Cookies' });
        this.cartHeaderLink = page.getByRole('link', { name: 'Cart' });
        this.searchInput = page.locator('#search_textbox');
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.cartIcon = page.getByRole('link', { name: 'Cart' });
    }

    /**
     * Navigates to a specific path relative to the base URL (e.g., '/en/account/login').
     * @param path The relative path to navigate to.
     */
    async navigateTo(path: string): Promise<void> {
      const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
        console.log(`Navigating to: ${url}`);
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    async acceptCookies(): Promise<void> {
        // We use try-catch because the cookie banner might not always be present
        try {
            await this.cookieAcceptButton.click({ timeout: 5000 });
        } catch (error) {
            // Log that the cookie button was not found or already accepted, but don't fail the test
            console.log("Cookie banner not visible or already dismissed.");
        }
    }

    get signInButton() {
        return this.signInLink;
    }

    get cartButton(): Locator {
        return this.cartIcon;
    }

    async performSearch(query: string): Promise<void> {
        await this.searchInput.fill(query);
        // Press Enter to submit the search form
        await this.searchInput.press('Enter');

        // Wait for the navigation to the new results page
        await this.page.waitForLoadState('domcontentloaded');
    }

    async logout(): Promise<void> {
        await this.logoutLink.click();
        // Wait for the navigation/redirection to complete. 
        await this.page.waitForLoadState('domcontentloaded');
    }
}
