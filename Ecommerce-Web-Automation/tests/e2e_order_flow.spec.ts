import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { CHECKOUT_PRODUCTS } from '../data/TestData';
import { VALID_USER } from '../data/TestData';
import testConfig from '../../playwright.config';

test.describe('E2E Full Order Placement Flow', () => {

    test('E2E_001: Execute full product search, add to cart, checkout, and logout', async ({ page }) => {
        const baseURL = testConfig.use!.baseURL as string;
        if (!baseURL) {
            throw new Error('baseURL is not configured in Playwright config.');
        }

        // Initialize all Page Objects, passing baseURL consistently
        const loginPage = new LoginPage(page, baseURL);
        const resultsPage = new SearchResultsPage(page, baseURL!);
        const detailsPage = new ProductDetailsPage(page, baseURL!);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const orderConfirmationPage = new OrderConfirmationPage(page);

        // --- 1. SETUP & LOGIN ---
        console.log('--- 1. Performing Login ---');

        // 1a. Navigate to the Home Page
        await loginPage.navigateTo('/en');

        
        if (await loginPage.cartIcon.isVisible({ timeout: 3000 })) {
            console.log('Cart icon visible: clicking it to reveal Sign In button');
            await loginPage.cartIcon.click();

            // Wait for Sign In button to appear after clicking cart
            await loginPage.signInLink.waitFor({ state: 'visible', timeout: 5000 });
            await loginPage.clickSignInbutton();
        } else if (await loginPage.signInLink.isVisible({ timeout: 3000 })) {
            console.log('Sign In button visible directly');
            await loginPage.clickSignInbutton();
        } else {
            throw new Error('Neither Cart icon nor Sign In button is visible on the homepage');
        }
        // 1b. Perform Login
        await loginPage.performLogin(VALID_USER.email, VALID_USER.password);

        // --- 2. ADD PRODUCTS TO CART ---
        console.log('--- 2. Adding Products to Cart ---');


        for (const product of CHECKOUT_PRODUCTS) {
            await resultsPage.performSearch(product.searchQuery);
            await resultsPage.addProductToCart(product.productLinkName);
        }

        // --- 3. BEGIN CHECKOUT ---
        console.log('--- 3. Starting Checkout ---');
        await cartPage.proceedToCheckout();

        // --- 4. CHECKOUT FUNNEL ---
        console.log('--- 4. Completing Checkout Steps ---');
        await checkoutPage.selectDeliveryTimeSlot();
        await checkoutPage.selectPaymentMethod();
        await checkoutPage.handleSubstitution();
        await checkoutPage.confirmPlaceOrder();

        // --- 5. ORDER CONFIRMATION ---
        console.log('--- 5. Validating Order Confirmation ---');
        await orderConfirmationPage.verifyOrderConfirmed();
    });
});
