import type { RamenRecord } from "./types";

const STORAGE_KEY = "data";

function newId(): string {
  // crypto.randomUUID はセキュアコンテキスト（https / localhost）でのみ使える
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * 保存されている値を RamenRecord[] に正規化する。
 * 旧形式（id が無い / rating が文字列）のデータもここで拾い上げる。
 * 1件でも形が壊れていれば null を返す。
 */
export function normalize(value: unknown): RamenRecord[] | null {
  if (!Array.isArray(value)) return null;

  const records: RamenRecord[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) return null;
    const { id, shop, date, rating } = item as Record<string, unknown>;

    if (typeof shop !== "string" || typeof date !== "string") return null;

    // 旧形式では rating が "3.5" のような文字列で入っている
    const parsedRating = typeof rating === "number" ? rating : Number(rating);
    if (!Number.isFinite(parsedRating)) return null;

    records.push({
      id: typeof id === "string" && id !== "" ? id : newId(),
      shop,
      date,
      rating: parsedRating,
    });
  }
  return records;
}

export function loadHistory(): RamenRecord[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // プライベートブラウズ等で localStorage 自体が触れないケース
    return [];
  }
  if (!raw) return [];

  try {
    const records = normalize(JSON.parse(raw));
    if (!records) return [];
    // 旧形式を読み込んだ場合は、この時点で新形式に書き戻しておく
    if (records.length > 0 && raw !== JSON.stringify(records)) {
      saveHistory(records);
    }
    return records;
  } catch {
    return [];
  }
}

export function saveHistory(records: RamenRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    alert(
      "保存に失敗しました。端末の空き容量が不足している可能性があります。\n共有ボタンから記録をエクスポートしてください。"
    );
  }
}

export { newId };
