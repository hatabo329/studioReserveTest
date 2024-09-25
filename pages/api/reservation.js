import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, date, studio, startTime, endTime, phone, memo } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const timestamp = new Date().toLocaleString();  // 予約された日時
    const spreadsheetId = '1PGKlMo3vF484lBJSLMfdCaA_OFtEoskdnloAXEL2JfY';

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);  // ランダムな9桁のIDを生成
      }
      

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:K',  // A列からK列までの範囲に保存
            valueInputOption: 'RAW',
            resource: {
              values: [[name, email, date, studio, startTime, endTime, generateUniqueId(), '予約済み', phone, memo, timestamp]],
            },
          });

      res.status(200).json({ message: 'Reservation successful' });
    } catch (error) {
        console.error('Error appending to spreadsheet:', error);  // エラー内容をコンソールに出力
        res.status(500).json({ error: 'Error adding reservation' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
