// RatingCircle component
import React from 'react';

export default function RatingCircle({ value, userRating }: { value?: number; userRating?: number }) {
  const v = userRating ?? value ?? 0;
  let bg = '#e5e7eb';
  if (v >= 7) bg = '#16a34a';
  else if (v >= 5) bg = '#f59e0b';
  else if (v >= 3) bg = '#ef4444';
  return (
    <div style={{position:'absolute', top:8, right:8}}>
      <div style={{width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:bg, color:'#fff', fontWeight:700}}>
        {Math.round(v) || '-'}
      </div>
    </div>
  );
}
