import { google } from 'googleapis';

export default async function handler(req, res) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = 'your-spreadsheet-id';
  const range = 'Sheet1!A:C'; // スプレッドシートの範囲

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values || [];
    const reservations = rows.map((row) => ({ name: row[0], email: row[1], date: row[2] }));

    res.status(200).json(reservations);
  } catch {
    res.status(500).json({ error: 'Error fetching reservations' });
  }
}
