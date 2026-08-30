// アプリ全体で使う記録の型
export type RamenRecord = {
  id: string;
  shop: string;
  date: string; // YYYY-MM-DD
  rating: number; // 0.5 〜 5.0（0.5刻み）
  memo?: string; // 感想。未記入なら省略する
};
