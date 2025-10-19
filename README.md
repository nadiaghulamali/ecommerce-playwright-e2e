QA Assessment: E-commerce Automation & API Testing
This project delivers the technical assessment, including web E2E automation (Playwright/TypeScript) and API validation (Postman).

1. Project Structure
Folder

Content

docs/

Test Plan, Manual Test Cases, Bug Reports, QA Proposal

automation/

Playwright E2E Tests (Login, Cart, Validation)

api-tests/

Postman Collection for FakeStoreAPI Validation

2. Setup & Installation
Prerequisite: Node.js (v16+)

Clone the repository:

git clone (https://github.com/nadiaghulamali/ecommerce-playwright-e2e.git)

Install dependencies and browser drivers:

npm install
npx playwright install

3. Execution Commands
Command

Action

npx playwright test

Run all Playwright E2E tests (headless mode).

run specific e2e tests

npx playwright test automation/tests/e2e_order_flow.spec.ts --headed

npm run test:ui

Recommended: Launch the Playwright UI for debugging.

API tests are run by importing the JSON file in api-tests/ into Postman.

4. Final Deliverable
 Demo Video :
[PLACEHOLDER: Insert Your Demo Video Link Here]