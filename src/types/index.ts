export interface Profile {
  id: string;
  name: string;
  avatar_color: string;
  created_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  status: 'available' | 'in_use' | 'maintenance';
  checked_out_by: string | null;
  checked_out_at: string | null;
  due_back_at: string | null;
  created_at: string;
  profiles?: Profile | null;
}

export interface EquipmentLog {
  id: string;
  equipment_id: string;
  user_id: string;
  action: 'checkout' | 'return';
  logged_at: string;
}

export interface Presence {
  id: string;
  user_id: string;
  status: 'in' | 'out';
  checked_in_at: string | null;
  updated_at: string;
  profiles?: Profile | null;
}

export interface Booking {
  id: string;
  room_name: string;
  title: string;
  booked_by: string | null;
  start_time: string;
  end_time: string;
  notes: string | null;
  created_at: string;
  profiles?: Profile | null;
}
