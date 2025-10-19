import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { RegistrationData } from '../data/RegistrationData'; // Import the complete data interface

// --- RANDOM DATA GENERATION HELPER ---
function generateRandomUserData(baseName: string): RegistrationData {
    const timestamp = new Date().getTime();
    // Ensures a unique email every time to prevent "user already exists" error
    const uniqueEmail = `${baseName}_${timestamp}@testdomain.com`;

    // Calculate a realistic past date for DOB 
    const birthYear = new Date().getFullYear() - (Math.floor(Math.random() * 20) + 20);
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const dobString = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    return {
        title: 'Miss',
        firstName: `TestFN-${timestamp.toString().slice(-4)}`,
        lastName: `TestLN-${timestamp.toString().slice(-4)}`,
        email: uniqueEmail,
        password: 'SecurePassword123!',
        dob: dobString, // Format YYYY-MM-DD

        // --- Stage 2 & 3 Data  ---
        country: 'United Arab Emirates',
        addressLine1: 'Dubai Marina',
        addressLine2: 'Cluster D',
        cityValue: '2', // Value for Dubai
        areaValue: '57', // Value for Dubai Marina (example)
        phoneNumber: `55${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        mapSearchTerm: 'Dubai Marina',
        mapSelectResult: 'Dubai Marina'
    };
}


test.describe('User Registration Flow', () => {

    test('Should successfully register a new user, complete address setup, and login', async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        const userData = generateRandomUserData('choithrams_register');
        await registrationPage.goToRegistrationForm();
        await registrationPage.completeFullRegistrationFlow(userData);

        // Final verification check 
        console.log(`Test passed: Full registration and auto-login completed for: ${userData.email}`);
    });
});
