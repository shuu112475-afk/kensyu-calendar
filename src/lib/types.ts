export type TrainingFormat = "online" | "onsite";

export type ApplicationStatus = "not_applied" | "applied" | "not_needed";

export type ParticipationStatus = "none" | "planned" | "attended" | "absent";

export interface Training {
  id: string;
  user_id: string;
  title: string;
  overview: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  format: TrainingFormat | null;
  venue: string | null;
  prefecture: string | null;
  organizer: string | null;
  target_occupation: string | null;
  field: string | null;
  fee: number | null;
  capacity: number | null;
  credit_info: string | null;
  apply_url: string | null;
  detail_url: string | null;
  application_deadline: string | null;
  application_status: ApplicationStatus;
  is_favorite: boolean;
  participation_status: ParticipationStatus;
  key_points: string | null;
  learnings: string | null;
  work_application: string | null;
  resource_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  occupation: string | null;
  specialty: string | null;
  region: string | null;
  created_at: string;
}

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  not_applied: "未申込",
  applied: "申込済み",
  not_needed: "申込不要",
};

export const PARTICIPATION_STATUS_LABEL: Record<ParticipationStatus, string> = {
  none: "未設定",
  planned: "参加予定",
  attended: "参加済み",
  absent: "欠席",
};

export const FORMAT_LABEL: Record<TrainingFormat, string> = {
  online: "オンライン",
  onsite: "現地開催",
};

export const TRAINING_FIELDS = [
  "CT",
  "MRI",
  "核医学",
  "X線撮影",
  "血管造影",
  "放射線治療",
  "感染管理",
  "急変対応",
  "薬剤管理",
  "検査技術",
  "医療安全",
  "その他",
] as const;

export const TRAINING_FIELD_ITEMS: Record<string, string> = Object.fromEntries(
  TRAINING_FIELDS.map((field) => [field, field]),
);
