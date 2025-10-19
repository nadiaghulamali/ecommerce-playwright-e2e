import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Correct import for the Page Object
import { INVALID_USER, VALID_USER } from '../data/TestData'; 

// Load environment variables securely from .env
import 'dotenv/config'; 

test.describe('Authentication and Login Flow Validation', () => {

    let loginPage: LoginPage;
    const validPassword = process.env.TEST_USER_PASSWORD; 

    // Setup: Initialize Page Objects before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        
        // Ensure the password is loaded for the test suite
        expect(validPassword, 'TEST_USER_PASSWORD must be defined in the .env file').toBeDefined();
    });

    // CH-TC-001 - Valid Login
    test('Should successfully log in with valid credentials', async ({page}) => {
         const signInLink = page.locator('header a[href="/login"]'); 
        await page.goto('/');
        await loginPage.acceptCookies();
        await signInLink.click();
        await loginPage.performLogin(VALID_USER.email, validPassword!);
         const accountLink = page.locator('header a[href="/myaccount"]');
        await expect(accountLink).toBeVisible();
        // Verification
        // await loginPage.verifySuccessfulLogin();
    });

    // CH-TC-004 - Invalid credentials
    test('Should display error message with invalid credentials', async () => {
        const expectedErrorMessage = 'The email or password provided is incorrect.';
        
        // Action with invalid credentials
        await loginPage.performLogin(INVALID_USER.email, INVALID_USER.password);

        // Verification
        await loginPage.verifyLoginFailure(expectedErrorMessage);
    });

    // Negative Test: Missing password 
    test('Should require password and display validation error', async () => {
        const expectedErrorMessage = 'Password field is required.';
        
        // Action with missing password
        await loginPage.performLogin(VALID_USER.email, '');

        // Verification 
        await loginPage.verifyLoginFailure(expectedErrorMessage);
    });
});
