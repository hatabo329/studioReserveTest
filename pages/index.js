import ReservationCalendar from '../components/ReservationCalendar.tsx';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">スタジオ予約システム</h1>
      <p className="text-center mb-8">
        空いている時間帯をクリックして予約を進めてください。
      </p>
      
      {/* カレンダーコンポーネントをここに表示 */}
      <ReservationCalendar />
    </div>
  );
}
