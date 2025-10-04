'use client';
import { useEffect } from 'react';

export default function GuestInitializer() {
  useEffect(() => {
    async function init() {
      try {
        const existing = localStorage.getItem('tmdb_guest_session_id');
        if (existing) return;
        const res = await fetch('/api/guest');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.guest_session_id) {
          localStorage.setItem('tmdb_guest_session_id', data.guest_session_id);
        }
      } catch (e) {
        console.error('guest init failed', e);
      }
    }
    init();
  }, []);
  return null;
}
