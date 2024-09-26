import { useState, useEffect } from 'react';
import styles from './ReservationTable.module.css';  // CSSモジュールのインポート

// 9:00から20:00までのタイムスロットを設定
const hours = [
  '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
]; // タイムスロット

const DAYS_PER_PAGE = 14; // 常に14日分を表示

export default function ReservationTable() {
  const [reservations, setReservations] = useState([]);
  const [days, setDays] = useState([]);  // 表示する日付リスト
  const [isPopupOpen, setIsPopupOpen] = useState(false);  // ポップアップの表示・非表示
  const [selectedStartTime, setSelectedStartTime] = useState('');  // 選択された開始時間
  const [selectedDay, setSelectedDay] = useState('');  // 選択された日付
  const [name, setName] = useState('');  // フォームの名前
  const [phone, setPhone] = useState('');  // フォームの電話番号
  const [selectedEndTime, setSelectedEndTime] = useState('');  // 終了時間

  useEffect(() => {
    // Google Sheets APIから予約データを取得
    const fetchReservations = async () => {
      try {
        const res = await fetch('/api/getReservations');
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };
    fetchReservations();
    
    // 本日から14日分の日付を生成
    generateDays();
  }, []);

  // 本日から14日分の日付を生成する関数
  const generateDays = () => {
    const today = new Date();
    const generatedDays = [];
    
    for (let i = 0; i < DAYS_PER_PAGE; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      generatedDays.push(nextDay.toISOString().split('T')[0]);  // YYYY-MM-DD形式に変換して追加
    }

    setDays(generatedDays);
  };

  // 特定の日と時間帯に予約があるかを確認する関数
  const isReserved = (day, time) => {
    return reservations.some((reservation) => {
      const reservationDate = reservation[2];  // 予約の日付
      const reservationStartTime = reservation[4]; // 開始時間
      const reservationEndTime = reservation[5];   // 終了時間

      // 開始時間から終了時間の間のスロットに「×」を表示
      const startHour = parseInt(reservationStartTime.split(':')[0], 10);
      const endHour = parseInt(reservationEndTime.split(':')[0], 10);
      const currentHour = parseInt(time.split(':')[0], 10);

      return reservationDate === day && currentHour >= startHour && currentHour <= endHour;
    });
  };

  // 空いている時間帯をクリックしたときの処理
  const handleCellClick = (day, time) => {
    setSelectedDay(day);  // 選択された日付を設定
    setSelectedStartTime(time);  // 選択された開始時間を設定
    setIsPopupOpen(true);  // ポップアップを表示
  };

  // ポップアップを閉じる処理
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reservationData = {
      name,
      phone,
      date: selectedDay,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
    };

    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if (res.ok) {
        alert('予約が完了しました！');
        closePopup();  // ポップアップを閉じる
        // テーブルを再度更新
        const updatedReservations = await res.json();
        setReservations(updatedReservations);
      } else {
        alert('予約に失敗しました。');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('予約にエラーが発生しました。');
    }
  };

  return (
    <div>
      <div className={styles['table-wrapper']}>
        <table className={styles.table}> {/* クラス名の適用 */}
          <thead>
            <tr>
              <th className={styles.th}>時間</th>
              {days.map((day, index) => (
                <th key={index} className={styles.th}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((time, index) => (
              <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
                <td className={styles.td}>{time}</td>
                {days.map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={styles.td}
                    onClick={() => !isReserved(day, time) && handleCellClick(day, time)}  // 空き時間ならクリック可能
                  >
                    {isReserved(day, time) ? '×' : '○'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ポップアップの予約フォーム */}
      {isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>予約フォーム</h2>
            <p>予約日: {selectedDay}</p>
            <p>開始時間: {selectedStartTime}</p>

            {/* 予約フォーム */}
            <form onSubmit={handleSubmit}>
              <label htmlFor="endTime">終了時間:</label>
              <select
                id="endTime"
                name="endTime"
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
              >
                {hours.filter(h => h > selectedStartTime).map((endTime) => (
                  <option key={endTime} value={endTime}>{endTime}</option>
                ))}
              </select>

              <label htmlFor="name">名前:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="phone">電話番号:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <button type="submit">予約する</button>
            </form>

            <button onClick={closePopup}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}
