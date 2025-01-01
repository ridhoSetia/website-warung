// api/data.js
import { google } from 'googleapis';

const credentials = process.env.GOOGLE_CREDENTIALS; // Pastikan ini disetting di Vercel
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = "1vdfYbD-qYvKbnE-G3ZcDI5Chg8OU5G1bkIcmw_o6DLU";
const RANGE = "Sheet1!A1:E";

export default async function handler(req, res) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).send("No data found");
    }

    const formattedData = rows.slice(1).map((row, index) => ({
      nama: row[0],
      harga: row[1],
      gambar: row[2],
      isi: row[3],
      kategori: row[4],
      iProduct: index + 1,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
}
