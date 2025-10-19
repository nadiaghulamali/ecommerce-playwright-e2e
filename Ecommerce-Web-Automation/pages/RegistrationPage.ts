import { Page, Locator, expect } from '@playwright/test';
import { RegistrationData } from '../data/RegistrationData'; 

export class RegistrationPage {
    readonly page: Page;

    // --- Navigation and General Locators ---
    readonly signInLink: Locator;
    readonly registerNowButton: Locator;

    // ---Locators: Personal Details ---
    readonly titleDropdown: Locator;
    readonly titleOption: (title: string) => Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly dobInput: Locator;
    readonly nextStepButton: Locator; 

    // --- Locators: Country Selection ---
    readonly nationalityDropdown: Locator;
    readonly countryOption: (country: string) => Locator;
    readonly finalNextStepButton: Locator; 

    // ---  Locators: Address and Map Pinning
    readonly addressLine1Input: Locator;
    readonly addressLine2Input: Locator;
    readonly cityDropdown: Locator; 
    readonly areaDropdown: Locator; 
    readonly phoneNumberInput: Locator;
    readonly saveAddressButton: Locator;
    readonly mapSearchInput: Locator; 
    readonly mapSearchResult: (result: string) => Locator;
    readonly mapConfirmLink: Locator;

    // --- Post-Registration Success Indicator ---
    readonly successfulLoginIndicator: Locator;

    constructor(page: Page) {
        this.page = page;

        this.signInLink = page.locator('a.js-siginin').first();
        this.registerNowButton = page.getByRole('link', { name: 'Create a new account' });
        this.titleDropdown = page.getByText('---------').nth(1);
        this.titleOption = (title: string) => page.getByRole('listitem', { name: title });
        this.firstNameInput = page.getByRole('textbox', { name: 'First name*' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last name*' });
        this.emailInput = page.getByRole('textbox', { name: 'Email address*' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
        this.dobInput = page.getByPlaceholder('/01/1980');
        this.nextStepButton = page.getByRole('button', { name: 'Next step' });
        this.nationalityDropdown = page.locator('#id_registration-nationality');
        this.countryOption = (country: string) => page.getByRole('listitem', { name: country });
        this.finalNextStepButton = page.locator('.register-form').getByRole('button', { name: 'Next step' }).nth(1);
        this.addressLine1Input = page.getByRole('textbox', { name: 'Address line 1' });
        this.addressLine2Input = page.getByRole('textbox', { name: 'Address line 2' });
        this.cityDropdown = page.locator('#id_city');
        this.areaDropdown = page.locator('#id_area');
        this.phoneNumberInput = page.getByRole('textbox', { name: '123 4567' });
        this.saveAddressButton = page.locator('#address-save-btn');
        this.mapSearchInput = page.getByRole('textbox', { name: 'Find your location' });
        this.mapSearchResult = (result: string) => page.getByText(result);
        this.mapConfirmLink = page.getByRole('link', { name: 'Confirm' });

        this.successfulLoginIndicator = page.getByRole('heading', { name: 'Hello,' });
    }

    /**
     * Navigates directly to the registration form from the homepage.
     */
    async goToRegistrationForm() {
        await this.page.goto('https://choithramsgcc.com/');
        await this.page.getByRole('link', { name: 'Cart' }).click();
        await this.page.waitForTimeout(500);
        await this.signInLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.signInLink.click({ force: true });
        console.log('Clicked: Header Sign In Link (forced)');
        await expect(this.registerNowButton).toBeVisible();
        await this.registerNowButton.click();
        await expect(this.firstNameInput).toBeVisible();
    }

    /**
     * Private helper for Stage 1: Fills out Title, Name, Email, Password, and DOB.
     */
    private async _completePersonalDetails(data: RegistrationData) {

        await this.titleDropdown.selectOption({ value: data.title });

        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        console.log(`Filling registration form for email: ${data.email}`);
        await this.emailInput.fill(data.email);
        await this.passwordInput.fill(data.password);
        await this.dobInput.fill(data.dob);
    }

    /**
     *  Selects the country and proceeds to address stage.
     */
    private async _completeCountrySelection(data: RegistrationData) {


        await this.page.locator('.selectric-nationality').click();
        // Click the country from the visible list
        await this.page.locator('.selectric-items li', { hasText: data.country }).click();
        await this.nextStepButton.click();
        await expect(this.addressLine1Input).toBeVisible();
    }

    /**
     *  Fills address details, searches the map, and saves.
     */
    private async _completeAddressStage(data: RegistrationData) {
        await this.addressLine1Input.fill(data.addressLine1);
        await this.addressLine2Input.fill(data.addressLine2);

        await this.cityDropdown.selectOption(data.cityValue);
        await this.areaDropdown.selectOption(data.areaValue);

        await this.page.locator('.pin-location').nth(1).click();

        await this.mapSearchInput.waitFor({ state: 'visible', timeout: 50000 });

        await this.mapSearchInput.fill(data.mapSearchTerm);
        await this.mapSearchInput.press('Enter');
        // 3. Wait for and select the desired search result
        await this.mapSearchResult(data.mapSelectResult).waitFor({ state: 'visible', timeout: 50000 });
        await this.mapSearchResult(data.mapSelectResult).click();

        // 4. Wait for and click the "Confirm" link
        await this.mapConfirmLink.waitFor({ state: 'visible', timeout: 50000 });
        await this.mapConfirmLink.click();
        await this.phoneNumberInput.fill(data.phoneNumber);

        // Save the address
        await this.saveAddressButton.click();
       await this.successfulLoginIndicator.waitFor({ state: 'visible', timeout: 20000 });
    }

    /**
     * Completes the multi-stage registration process and verifies successful login.
     */
    async completeFullRegistrationFlow(data: RegistrationData) {
        await this._completePersonalDetails(data);
        await this._completeCountrySelection(data);
        await this._completeAddressStage(data);

        await expect(this.successfulLoginIndicator).toContainText(`Hello, ${data.firstName}!`);
    }
}
