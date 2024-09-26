import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, date, studio, startTime, endTime, phone, memo } = req.body;

    // 予約IDを生成
    function generateUniqueId() {
      return Math.random().toString(36).substr(2, 9);  // ランダムな9桁のIDを生成
    }

    const reservationId = generateUniqueId();  // 予約ID
    const status = '予約済み';  // ステータスはデフォルトで「予約済み」
    const reservationTimestamp = new Date().toLocaleString();  // 現在の日時（予約の登録時間）

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1PGKlMo3vF484lBJSLMfdCaA_OFtEoskdnloAXEL2JfY';  // スプレッドシートIDを指定
    const range = 'Sheet1!A:K'; // A列からK列までの範囲に保存

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: [[name, email, date, studio, startTime, endTime, reservationId, status, phone, memo, reservationTimestamp]],
        },
      });

      // 予約後の最新データを返す
      const updatedReservations = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:K',
      });

      // Google Sheets APIのレスポンスを確認
      console.log('Google Sheets API response:', updatedReservations);

      res.status(200).json(updatedReservations.data.values);
    } catch (error) {
      console.error('Error appending to spreadsheet:', error);  // エラーログを出力
      res.status(500).json({ error: 'Error adding reservation' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
