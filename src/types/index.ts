export interface Profile {
  id: string;
  name: string;
  avatar_color: string;
}

export interface Equipment {
  id: string;
  name: string;
  status: "available" | "checked_out" | "maintenance";
  checked_out_by: string | null;
  overlay_key: string;
  updated_at: string;
}

export interface EquipmentLog {
  id: string;
  equipment_id: string;
  user_id: string;
  action: "check_out" | "return";
  created_at: string;
}

export interface Presence {
  id: string;
  user_id: string;
  status: "in" | "out";
  updated_at: string;
}
