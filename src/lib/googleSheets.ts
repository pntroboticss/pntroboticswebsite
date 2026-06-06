import { google } from "googleapis";

// Initialize the Google Auth client
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle escaped newlines in env
    },
    scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
    ],
});

const sheets = google.sheets({ version: "v4", auth });

/**
 * Appends a row of data to a specific tab in the Google Sheet
 * @param tabName The name of the tab (e.g., "Contacts" or "Custom Projects")
 * @param values Array of values to append in the row
 */
export async function appendToGoogleSheet(tabName: string, values: any[]) {
    try {
        const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
        
        if (!spreadsheetId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            console.warn("Google Sheets credentials are missing. Skipping sync.");
            return false;
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${tabName}!A1`, // It will find the next empty row automatically
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [values],
            },
        });

        return response.status === 200;
    } catch (error) {
        console.error("Error appending to Google Sheet:", error);
        return false;
    }
}

/**
 * Reads all rows from a specific tab in the Google Sheet
 * @param tabName The name of the tab to read (e.g., "Contacts")
 * @returns Array of rows, where each row is an array of strings
 */
export async function readFromGoogleSheet(tabName: string): Promise<any[][]> {
    try {
        const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
        
        if (!spreadsheetId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            console.warn("Google Sheets credentials are missing. Skipping read.");
            return [];
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${tabName}!A:Z`,
        });

        return response.data.values || [];
    } catch (error) {
        console.error("Error reading from Google Sheet:", error);
        return [];
    }
}
