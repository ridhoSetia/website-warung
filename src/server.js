const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());

// Load credentials
const credentials = require("../config/credentials.json");

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Spreadsheet details
const SPREADSHEET_ID = "1vdfYbD-qYvKbnE-G3ZcDI5Chg8OU5G1bkIcmw_o6DLU"; // Ganti dengan ID spreadsheet Anda
const RANGE = "Sheet1!A1:E"; // Ganti dengan sheet dan range data Anda

app.get("/data", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).send("No data found");
    }

    // Formatting data
    const formattedData = rows.slice(1).map((row, index) => ({
      nama: row[0],
      harga: row[1],
      gambar: row[2],
      isi: row[3],
      kategori: row[4],
      iProduct: index + 1, // Assign index + 1 as product ID
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
