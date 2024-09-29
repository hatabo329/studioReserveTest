'use client';

import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface ReservationFormProps {
  initialDate: string;
  initialStartTime: string;
  initialEndTime: string;
  onClose: () => void;
}

export default function ReservationForm({ initialDate, initialStartTime, initialEndTime, onClose }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: initialDate,
    startTime: initialStartTime,
    endTime: initialEndTime,
    people: '',
    studio: 'スタジオ1', // 初期値をスタジオ1に設定
    groupName: '',
    memo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('予約が完了しました！');
        onClose();
      } else {
        console.error('予約に失敗しました');
      }
    } catch (error) {
      console.error('予約送信中にエラーが発生しました:', error);
    }
  };

  console.log('受け取ったデータ:', formData);


  return (
    <>
      <DialogHeader>
        <DialogTitle>スタジオ予約</DialogTitle>
        <DialogDescription>
          予約情報を入力してください。
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4"> {/* ここで全体のスペースを確保 */}
        <div className="mb-4"> {/* 各項目の上下に余白を追加 */}
          <Label htmlFor="name">代表者氏名</Label><br/>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="phone">電話番号</Label><br/>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="email">メールアドレス</Label><br/>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="date">予約日</Label><br/>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="startTime">開始時間</Label><br/>
          <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="endTime">終了時間</Label><br/>
          <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="people">利用人数</Label><br/>
          <Input id="people" name="people" type="number" value={formData.people} onChange={handleChange} required />
        </div>
        <div className="mb-4">
        <Label htmlFor="studio">スタジオ</Label><br/>
          <Input
            id="studio"
            name="studio"
            value={formData.studio}
            readOnly // 読み取り専用にして変更できないようにする
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="groupName">団体名</Label><br/>
          <Input id="groupName" name="groupName" value={formData.groupName} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <Label htmlFor="memo">メモ</Label><br/>
          <Textarea id="memo" name="memo" value={formData.memo} onChange={handleChange} />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>キャンセル</Button>
          <Button type="submit">予約を送信</Button>
        </div>
      </form>
    </>
  )
}