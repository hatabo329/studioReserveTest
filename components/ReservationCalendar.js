import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';

export default function ReservationCalendar() {
  const [reservations, setReservations] = useState([]);
  const [selectedDateReservations, setSelectedDateReservations] = useState([]);  // 選択された日の予約情報

  const isTimeSlotAvailable = (date, startTime, endTime) => {
    return !reservations.some((reservation) => {
      const reservationDate = new Date(reservation[2]);  // 予約日
      const reservationStartTime = reservation[4];  // 予約開始時間
      const reservationEndTime = reservation[5];    // 予約終了時間
  
      if (reservationDate.toDateString() === date.toDateString()) {
        return (
          (startTime >= reservationStartTime && startTime < reservationEndTime) ||  // 重複
          (endTime > reservationStartTime && endTime <= reservationEndTime)
        );
      }
      return false;
    });
  };
  

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
  }, []);

  // 日付が選択されたとき、その日の予約を表示
  const handleDateClick = (date) => {
    const reservationsForDay = reservations.filter((reservation) => {
      const [year, month, day] = reservation[2].split('-'); // 予約日 (YYYY-MM-DD)
      const reservationDate = new Date(year, month - 1, day);
      return reservationDate.toDateString() === date.toDateString();
    });

    setSelectedDateReservations(reservationsForDay);  // 選択された日の予約情報を設定
  };

  return (
    <div>
      <h2>予約状況カレンダー</h2>
      {/* カレンダーで日付を選択 */}
      <Calendar onClickDay={handleDateClick} locale="ja-JP" />

      {/* 選択された日の予約情報をリスト表示 */}
      {selectedDateReservations.length > 0 ? (
        <div>
          <h3>{`選択された日の予約 (${selectedDateReservations.length} 件)`}</h3>
          <ul>
            {selectedDateReservations.map((reservation, index) => (
              <li key={index}>
                {`${reservation[4]} - ${reservation[5]} (スタジオ: ${reservation[3]})`}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>この日に予約はありません。</p>
      )}
    </div>
  );
}
