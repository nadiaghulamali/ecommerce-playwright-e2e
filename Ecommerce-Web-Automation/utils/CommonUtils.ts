/**
 * Utility class for common functions that are not directly tied to browser interaction.
 * This includes data formatting, string parsing, and complex calculations.
 */
export class CommonUtils {

    /**
     * Parses a currency string (e.g., "$1,234.56" or "AED 99.99") into a clean number.
     * This is crucial for financial assertions in the Cart and Checkout pages.
     * @param currencyText The raw text string from the price element.
     * @returns The clean numeric value.
     */
    static parseCurrencyToNumber(currencyText: string): number {
        // Remove currency symbols, commas, and any non-digit/non-period characters.
        const cleanText = currencyText.replace(/[^\d.]/g, '');
        return parseFloat(cleanText);
    }
}
