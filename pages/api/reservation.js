import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, phone, date, startTime, endTime } = req.body;

        // 送信された予約データを確認
        console.log('Reservation data:', req.body);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1PGKlMo3vF484lBJSLMfdCaA_OFtEoskdnloAXEL2JfY';  // スプレッドシートIDを指定
    const range = 'Sheet1!A:F'; // 保存するスプレッドシートの範囲

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: [[name, phone, date, startTime, endTime, '予約済み']],
        },
      });

      // 予約後の最新データを返す
      const updatedReservations = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:F',
      });

            // Google Sheets APIのレスポンスを確認
            console.log('Google Sheets API response:', updatedReservations);

      res.status(200).json(updatedReservations.data.values);
    } catch (error) {
      console.error('Error appending to spreadsheet:', error);
      res.status(500).json({ error: 'Error adding reservation' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
