import { google } from 'googleapis';

export default async function handler(req, res) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = '1PGKlMo3vF484lBJSLMfdCaA_OFtEoskdnloAXEL2JfY';  // スプレッドシートID
  const range = 'Sheet1!A:L';  // データの範囲を指定

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows.length) {
      // 必要に応じてデータを整形して返す
      const reservations = rows.map((row) => ({
        studio: row[0],       // スタジオ
        name: row[1],         // 代表者氏名
        phone: row[2],        // 電話番号
        date: row[3],         // 予約日
        startTime: row[4],    // 開始時間
        endTime: row[5],      // 終了時間
        email: row[6],        // メールアドレス
        people: row[7],       // 利用人数
        groupName: row[8],    // 団体名
        memo: row[9],         // メモ
        status: row[10],      // ステータス
        reservationId: row[11],  // 予約ID
        timestamp: row[12],   // 登録日時
      }));
      res.status(200).json({ reservations });
    } else {
      res.status(200).json({ reservations: [] });
    }
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
}
