import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { BasePage } from '../pages/BasePage';
import { CHECKOUT_PRODUCTS } from '../data/TestData'; 
import { VALID_USER } from '../data/TestData'; 

test.describe('E2E Full Order Placement Flow', () => {

    test('E2E_001: Execute full product search, add to cart, checkout, and logout', async ({ page, baseURL }) => {
        // Ensure baseURL is present before initialization
        if (!baseURL) {
            throw new Error('baseURL is not configured in Playwright config.');
        }

        // Initialize all Page Objects, passing baseURL consistently
        const loginPage = new LoginPage(page, baseURL);
        // Using non-null assertion '!' assuming Playwright config guarantees it.
        const resultsPage = new SearchResultsPage(page, baseURL!); 
        const detailsPage = new ProductDetailsPage(page, baseURL!);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const orderConfirmationPage = new OrderConfirmationPage(page);

        // --- 1. SETUP & LOGIN ---
        console.log('--- 1. Performing Login ---');

        // 1a. Navigate to the Home Page
        await loginPage.navigateTo('/en');

        // Post-Navigation validation (check that the cart link is present)
        await expect(loginPage.cartIcon).toBeVisible();

        // 1b. Click on the cart icon/link to proceed or reveal sign-in options
        // This is the first new step.
        await loginPage.cartIcon.click(); 
        await loginPage.clickSignInbutton()
        
        // 1c. Click on the Sign In link (inherited from BasePage)
        // This is the second new step, navigating to the dedicated login form page.
       

        // 1d. Perform the actual login using the dedicated method
        // This is the third new step.
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
        
        // --- 6. LOGOUT ---
        console.log('--- 6. Logging out ---');
        await loginPage.logout();
        
        // Final Validation: Ensure user is back on the home page and the Sign In link is visible
        await expect(loginPage.signInLink).toBeVisible();
    });
});
