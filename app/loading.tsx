'use client'
import { Spin } from 'antd';
import React from 'react';

export default function Loading() {
  return (
    <div style={{ display:'flex', height: '100vh', alignItems:'center', justifyContent:'center' }}>
      <Spin size="large" />
    </div>
  )
}
