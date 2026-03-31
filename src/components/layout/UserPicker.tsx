'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useUserStore } from '@/store/userStore';

export default function UserPicker() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { currentUserId, setCurrentUserId } = useUserStore();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.from('profiles').select('*').order('name').then(({ data }: { data: Profile[] | null; error: unknown }) => {
      if (data) setProfiles(data);
    });
  }, []);

  const current = profiles.find((p) => p.id === currentUserId);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#6b6b80', whiteSpace: 'nowrap' }}>You are:</span>
      <select
        value={currentUserId ?? ''}
        onChange={(e) => setCurrentUserId(e.target.value || null)}
        style={{
          background: '#1a1a24',
          color: current ? (current.avatar_color) : '#6b6b80',
          border: '1px solid #2a2a3a',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="">Select user...</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
