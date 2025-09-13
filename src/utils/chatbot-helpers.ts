import { translations } from "../utils/translations";

// UI 언어 타입
export type UILang = keyof typeof translations; // "ko" | "en" | "vi"

// 서버 코드 타입
export type LangCode = "ko" | "en" | "vi";
export type SlotCode = "morning" | "afternoon" | "anytime";

export const DEPT_CODES = [
  "unknown",
  "internal",
  "surgery",
  "pediatrics",
  "obgyn",
  "orthopedics",
  "derm",
  "ophthalmology",
  "ent",
  "psychiatry",
  "plastic",
  "dent",
  "other",
] as const;
export type DeptCode = (typeof DEPT_CODES)[number];

/** 언어 라벨 -> 언어 코드 */
export function langLabelToCode(label: string): LangCode {
  const s = (label || "").toLowerCase();
  if (
    ["한국어", "korean", "tiếng hàn"].some((v) => s.includes(v.toLowerCase()))
  )
    return "ko";
  if (["영어", "english", "tiếng anh"].some((v) => s.includes(v.toLowerCase())))
    return "en";
  if (
    ["베트남어", "vietnamese", "tiếng việt"].some((v) =>
      s.includes(v.toLowerCase())
    )
  )
    return "vi";
  // 디폴트
  return "vi";
}

/** (현재 UI 언어의) 진료과 라벨 -> 서버 dept 코드 */
export function deptLabelToCode(label: string, uiLang: UILang): DeptCode {
  const t = translations[uiLang];
  const idx = t.departments.findIndex((x) => x === label);
  return idx >= 0 ? DEPT_CODES[idx] : "unknown";
}

/** 시간 라벨 -> 슬롯 코드 (모델: morning/afternoon/anytime) */
export function timeLabelToSlot(label: string): SlotCode {
  const s = (label || "").toLowerCase();
  // ko
  if (s.includes("오전")) return "morning";
  if (s.includes("오후")) return "afternoon";
  if (s.includes("상관없음")) return "anytime";
  // en
  if (s.includes("morning")) return "morning";
  if (s.includes("afternoon")) return "afternoon";
  if (s.includes("any time") || s.includes("anytime")) return "anytime";
  // vi
  if (s.includes("sáng")) return "morning";
  if (s.includes("chiều")) return "afternoon";
  if (s.includes("bất kỳ")) return "anytime";
  // 디폴트
  return "anytime";
}

/** 언어 코드 -> 현재 UI 언어의 라벨 */
export function langCodeToLabel(code: LangCode, uiLang: UILang): string {
  const packs = {
    ko: ["한국어", "영어", "베트남어"],
    en: ["Korean", "English", "Vietnamese"],
    vi: ["Tiếng Hàn", "Tiếng Anh", "Tiếng Việt"],
  } as const;
  const arr = packs[uiLang];
  if (code === "ko") return arr[0];
  if (code === "en") return arr[1];
  return arr[2];
}

/** dept 코드 -> 현재 UI 언어의 라벨 */
export function deptCodeToLabel(code: DeptCode, uiLang: UILang): string {
  const idx = DEPT_CODES.indexOf(code);
  return idx >= 0 ? translations[uiLang].departments[idx] : code;
}

/** 슬롯 코드 -> 현재 UI 언어의 라벨 */
export function slotToLabel(slot: SlotCode, uiLang: UILang): string {
  const t = translations[uiLang];
  return slot === "morning"
    ? t.times[0]
    : slot === "afternoon"
    ? t.times[1]
    : t.times[2];
}
