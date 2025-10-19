import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv'; 
import path from 'path'; 

// 1. Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '.env') }); 

// 2. Define a function to get a guaranteed, non-empty base URL
const getBaseUrl = (): string => {
  const envUrl = process.env.BASE_URL;
  const fallback = 'https://www.choithrams.com';
  let finalUrl: string;

  // Determine the URL to use (Environment variable or fallback)
  if (!envUrl || envUrl.trim().length === 0) {
    console.warn(`WARNING: BASE_URL is missing or empty in .env. Using fallback URL: ${fallback}`);
    finalUrl = fallback;
  } else {
    finalUrl = envUrl;
  }
  
  // CRITICAL: Ensure the URL has a protocol (http:// or https://) to avoid "Cannot navigate to invalid URL"
  if (finalUrl && !finalUrl.startsWith('http')) {
      // Assuming HTTPS is the standard protocol if none is specified
      finalUrl = `https://${finalUrl}`;
      console.warn(`INFO: BASE_URL was missing a protocol (e.g., https://) and was automatically prefixed: ${finalUrl}`);
  }

  // Return the final, guaranteed-valid URL
  return finalUrl;
};

const BASE_URL = getBaseUrl();


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    /* 3. Assign the GUARANTEED, non-empty URL */
    baseURL: BASE_URL,

    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment these lines to enable other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
