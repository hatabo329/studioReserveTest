import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],  // 読み取り専用
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // 正しいスプレッドシートIDを設定
    const spreadsheetId = '1PGKlMo3vF484lBJSLMfdCaA_OFtEoskdnloAXEL2JfY';  
    const range = 'Sheet1!A:F';  // シート名と範囲を確認

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows.length) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
}
