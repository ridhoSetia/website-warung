const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../src")));

// Load credentials from environment variable
const credentials = (process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Spreadsheet details
const SPREADSHEET_ID = "1vdfYbD-qYvKbnE-G3ZcDI5Chg8OU5G1bkIcmw_o6DLU";
const RANGE = "Sheet1!A1:E";

// Sajikan file index.html dari root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

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
