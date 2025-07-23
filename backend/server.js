import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// โหลด credential จากไฟล์ JSON ที่ได้จาก Google Cloud
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_KEY_FILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = process.env.GOOGLE_SHEET_RANGE;

// อ่านข้อมูลทั้งหมด
app.get('/api/scores', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const header = rows[0]; // ['Group1', 'Group2', 'Group3', 'Group4']
    const dataRows = rows.slice(1); // ข้อมูลตัวเลข

    const result = header.map((groupName, colIdx) => {
      let sum = 0;
      dataRows.forEach(row => {
        const val = Number(row[colIdx]);
        if (!isNaN(val)) {
          sum += val;
        }
      });
      return {
        name: groupName,
        points: sum,
      };
    });

    console.log("Computed Result:", result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// อ่านคะแนนตาม Group
app.get('/api/points/:group', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return res.status(404).json({ error: 'No data found' });
    }

    // ข้าม header 
    const userRow = rows.slice(1).find(([name]) => name === req.params.name);

    if (!userRow) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ name: userRow[0], points: Number(userRow[1]) });
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
