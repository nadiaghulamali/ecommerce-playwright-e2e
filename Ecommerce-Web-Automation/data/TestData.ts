/**
 * Configuration file for all centralized test data, users, and product details.
 * All test files and Page Objects should import data from here.
 */

// --- INTERFACE ---
export interface ShippingDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
}

export type UserCredentials = {
    email: string;
    password: string;
    firstName: string;
};

// --- ENUMERATION ---
export enum PaymentMethod {
    COD = 'Cash on Delivery',
    CARD = 'Credit Card',
    PAYPAL = 'PayPal',
}

// Standard test user for valid login flow 
export const VALID_USER = {
    email: 'testemail123@gmail.com',
    password: 'SecurePassword123!',
};

// Test data for checkout flow 
export const CHECKOUT_PRODUCTS = [
    { searchQuery: 'Koita Oat Milk 1 ltr', productLinkName: 'Koita Oat Milk 1 ltr' },
    // { searchQuery: 'bread', productLinkName: 'Wikinger Bread' }
];

// Data for shipping details 
export const TEST_SHIPPING_DETAILS: ShippingDetails = {
    firstName: 'Automation',
    lastName: 'Tester',
    email: VALID_USER.email,
    phone: '5551234567',
    addressLine1: 'Jumeirah Lakes Towers, Cluster B, Apt 305'
};

// --- INVALID USER DATA (The missing export) ---
/**
 * Credentials for a user that should fail to log in (e.g., incorrect password).
 */
export const INVALID_USER: UserCredentials = {
    email: 'nonexistent@example.com',
    password: 'wrongpassword',
    firstName: 'Invalid',
};
