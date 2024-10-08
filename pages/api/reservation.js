import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, phone, date, startTime, endTime, email, people, groupName, memo, studio } = req.body;

        // デバッグ用: 受け取ったデータをコンソールに出力
        console.log('受け取ったデータ:', req.body);


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
    const range = 'Sheet1!A:M'; // A列からL列までの範囲に保存

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: [[
            studio,        // A列: スタジオ
            name,          // B列: 代表者氏名
            phone,         // C列: 電話番号
            date,          // D列: 予約日
            startTime,     // E列: 開始時間
            endTime,       // F列: 終了時間
            email,         // G列: メールアドレス
            people,     // H列: 利用人数
            groupName,     // I列: 団体名
            memo,          // J列: メモ
            status,        // K列: ステータス
            reservationId, // L列: 予約ID
            reservationTimestamp  // M列: 登録日時
          ]],
        },
      });

      // 予約後の最新データを返す
      const updatedReservations = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:L',
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
