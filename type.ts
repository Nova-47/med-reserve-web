export type Booking = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  symptom_note: string;
  preferred_date: string | null;
  preferred_time_slot: "morning" | "afternoon" | "anytime" | ""; // 빈값 가능성 방어
  language: "ko" | "en" | "vi";
  city: string;
  department:
    | "unknown"
    | "internal"
    | "surgery"
    | "pediatrics"
    | "obgyn"
    | "orthopedics"
    | "derm"
    | "ophthalmology"
    | "ent"
    | "psychiatry"
    | "plastic"
    | "dent"
    | "other";
  status: "pending" | "contacted" | "scheduled" | "cancelled";
  created_at: string; // ISO
};

export type CreateBookingReq = {
  name: string;
  phone?: string;
  email?: string; // phone/email 둘 중 하나는 필수
  symptom_note?: string;
  preferred_date?: string; // "YYYY-MM-DD"
  preferred_time_slot?: "morning" | "afternoon" | "anytime";
  language?: "ko" | "en" | "vi";
  city?: string;
  department?:
    | "unknown"
    | "internal"
    | "surgery"
    | "pediatrics"
    | "obgyn"
    | "orthopedics"
    | "derm"
    | "ophthalmology"
    | "ent"
    | "psychiatry"
    | "plastic"
    | "dent"
    | "other";
};

export type CreateBookingResp = {
  id: string;
  status: "pending" | "contacted" | "scheduled" | "cancelled";
};
