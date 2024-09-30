import { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style/big-calendar.css';
import ReservationForm from './ReservationForm';
import { Dialog, DialogContent } from './ui/dialog';
import CustomToolbar from './ui/CustomToolbar';

// サーバーサイドでは英語ロケールを使用（デフォルト設定）
moment.locale('en');

const localizer = momentLocalizer(moment);

// 予約データの型を定義
type Reservation = {
    date: string;
    startTime: string;
    endTime: string;
    name: string;
    email: string;
    phone: string;
    people: number;
    studio: string;
    groupName: string;
    memo: string;
    status: string;
    reservationId: string;
    timestamp: string;
};

type Slot = {
    start: Date;
    end: Date;
  };

export default function ReservationCalendar() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);  // 型定義を適用

  

  useEffect(() => {
    moment.locale('ja'); // クライアントサイドで日本語に設定
  }, []);

  // Googleスプレッドシートから予約データを取得
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/getReservations');  // APIからデータを取得
        const data = await response.json();
        setReservations(data.reservations);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };
    fetchReservations();
  }, []);

  const handleSelectSlot = useCallback((slotInfo: any) => {
    setSelectedSlot(slotInfo);
    setShowForm(true);
  }, []);



  const { min, max, scrollToTime } = useMemo(() => {
    const today = moment().startOf('day');
    return {
      min: moment(today).hour(9).toDate(),
      max: moment(today).hour(21).toDate(),
      scrollToTime: moment(today).hour(9).toDate(),
    };
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setSelectedSlot(null);
  };

  return (
    <div className="h-screen p-4">
      <div className="calendar-wrapper">
      <Calendar
  localizer={localizer}
  events={reservations.map((reservation) => ({
    start: new Date(reservation.date + ' ' + reservation.startTime),
    end: new Date(reservation.date + ' ' + reservation.endTime),
    title: reservation.status === '予約済み' ? '✕' : '◯',  // ステータスが「予約済み」なら✕、そうでなければ◯
  }))}
  startAccessor="start"
  endAccessor="end"
  style={{ height: '80vh', minWidth: '900px' }}
  selectable
  onSelectSlot={handleSelectSlot}
  min={min}
  max={max}
  scrollToTime={scrollToTime}
  step={60}
  timeslots={1}
  views={['week', 'day']}
  defaultView={Views.WEEK}
  toolbar={true}
  components={{
    toolbar: CustomToolbar,
  }}
/>
</div>


      {/* モーダルとして予約フォームを表示 */}
      {showForm && (
        <>
          {/* 背景を薄暗くするオーバーレイ */}
          <div className="modal-overlay" onClick={closeForm}></div>

          {/* モーダルウィンドウ */}
          <Dialog open={showForm} onOpenChange={closeForm}>
            <DialogContent className="modal-content max-h-[80vh] overflow-y-auto">
              {selectedSlot && (
                <ReservationForm
                  initialDate={moment(selectedSlot.start).format('YYYY-MM-DD')}
                  initialStartTime={moment(selectedSlot.start).format('HH:mm')}
                  initialEndTime={moment(selectedSlot.end).format('HH:mm')}
                  onClose={closeForm}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
