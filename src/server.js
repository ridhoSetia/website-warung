const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());

// Load credentials
const credentials = require("../config/crendentials.json");

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Spreadsheet details
const SPREADSHEET_ID = "1vdfYbD-qYvKbnE-G3ZcDI5Chg8OU5G1bkIcmw_o6DLU"; // Ganti dengan ID spreadsheet Anda
const RANGE = "Sheet1!A1:D"; // Ganti dengan sheet dan range data Anda

app.get("/data", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows.length) return res.status(404).send("No data found");

    const formattedData = rows.slice(1).map((row) => ({
      nama: row[0],
      harga: row[1],
      gambar: row[2],
      isi: row[3],
      kategori: row[4],
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
