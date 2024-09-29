import React from 'react';

interface CustomToolbarProps {
  label: string;  // labelの型をstringに指定
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onView: (view: 'month' | 'week' | 'day') => void;
}

export default function CustomToolbar({ label, onNavigate, onView }: CustomToolbarProps) {
  // "September 29 – October 05" のような日付範囲を分割して処理
  const [start, end] = label.split(' – ');

  // 月と日付を日本語形式に変換
  const formatToJapanese = (dateStr: string) => {
    const [month, day] = dateStr.split(' '); // "September 29" を [月, 日] に分割

    // 英語の月名を日本語に変換
    const monthMap: { [key: string]: string } = {
      January: '1月',
      February: '2月',
      March: '3月',
      April: '4月',
      May: '5月',
      June: '6月',
      July: '7月',
      August: '8月',
      September: '9月',
      October: '10月',
      November: '11月',
      December: '12月',
    };

    // 日本語の月名と日付を返す
    return `${monthMap[month]} ${day}日`;
  };

  const formattedStart = formatToJapanese(start);
  const formattedEnd = formatToJapanese(end);

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>Back</button>
        <button type="button" onClick={() => onNavigate('TODAY')}>Today</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>Next</button>
      </span>
      <span className="rbc-toolbar-label">{formattedStart} - {formattedEnd}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onView('month')}>Month</button>
        <button type="button" onClick={() => onView('week')}>Week</button>
        <button type="button" onClick={() => onView('day')}>Day</button>
      </span>
    </div>
  );
}
