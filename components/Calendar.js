import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';

export default function ReservationCalendar() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Googleスプレッドシートから予約情報を取得
    const fetchReservations = async () => {
      const res = await fetch('/api/getReservations');
      const data = await res.json();
      setReservations(data);  
    };
    fetchReservations();
  }, []);

  const tileDisabled = ({ date }) => {
    return reservations.some((reservation) => new Date(reservation.date).toDateString() === date.toDateString());
  };

  return <Calendar tileDisabled={tileDisabled} />;
}
