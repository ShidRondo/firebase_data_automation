const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { google } = require("googleapis");

const SPREADSHEET_ID = "1kQ1lzvpevib-DScs-pgmGFJ-hpaj9tE4M5KPAUBKFcA";
const SHEET_NAME = "Smart Sorter Data";

exports.syncFirestoreToSheets = onDocumentCreated(
  "smart_sorter_logs/{docId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data() || {};

    const classification = data.classification || "";
    const confidence = data.confidence || "";
    const timestamp = data.timestamp || "";
    const userId = data.user_id || "";

    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[classification, confidence, timestamp, userId]],
      },
    });
  }
);