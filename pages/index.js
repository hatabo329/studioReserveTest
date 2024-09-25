import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    studio: 'スタジオ1',  // デフォルトはスタジオ1
    startTime: '9:00',    // デフォルトの開始時間
    endTime: '10:00',     // デフォルトの終了時間
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 開始時間が終了時間より遅い場合はエラーメッセージを表示
    const startHour = parseInt(formData.startTime.split(":")[0]);
    const endHour = parseInt(formData.endTime.split(":")[0]);
    if (startHour >= endHour) {
      alert('終了時間は開始時間より後である必要があります');
      return;
    }

    const res = await fetch('/api/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="名前"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="メールアドレス"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="電話番号"
        value={formData.phone}
        onChange={handleChange}
        />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      {/* スタジオ選択 */}
      <select name="studio" value={formData.studio} onChange={handleChange}>
        <option value="スタジオ1">スタジオ1</option>
        <option value="スタジオ2">スタジオ2</option>
      </select>
      {/* 開始時間選択 */}
      <select name="startTime" value={formData.startTime} onChange={handleChange}>
        {Array.from({ length: 13 }, (_, i) => (
          <option key={i} value={`${9 + i}:00`}>
            {`${9 + i}:00`}
          </option>
        ))}
      </select>
      {/* 終了時間選択 */}
      <select name="endTime" value={formData.endTime} onChange={handleChange}>
        {Array.from({ length: 13 }, (_, i) => (
          <option key={i} value={`${10 + i}:00`}>
            {`${10 + i}:00`}
          </option>
        ))}
      </select>
      <textarea
        name="memo"
        placeholder="メモ/備考"
        value={formData.memo}
        onChange={handleChange}
        />
      <button type="submit">予約する</button>
    </form>
  );
}
