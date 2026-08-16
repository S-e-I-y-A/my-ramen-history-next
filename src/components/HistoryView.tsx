import { useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { RamenRecord } from "../types";

function HistoryView({
  history,
  onDelete,
  onSelect,
}: {
  history: RamenRecord[];
  onDelete: (id: string) => void;
  onSelect: (record: RamenRecord) => void;
}) {
  // 新しい記録が上に来るように並べる（元の配列は壊さない）
  const sorted = useMemo(
    () => [...history].sort((a, b) => b.date.localeCompare(a.date)),
    [history]
  );

  if (sorted.length === 0) {
    return (
      <p className="empty">
        「追加」ボタンから
        <br />
        最初の一杯を記録しよう！
      </p>
    );
  }

  return (
    <ul className="history">
      {sorted.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className="record"
            onClick={() => onSelect(item)}
          >
            <span className="record__shop">{item.shop}</span>
            <span className="record__date">{item.date}</span>
            <Rating
              value={item.rating}
              precision={0.5}
              readOnly
              size="small"
              // 親ボタンのタップ扱いに任せる
              tabIndex={-1}
            />
          </button>
          <IconButton
            aria-label={`${item.shop}の記録を削除`}
            color="error"
            onClick={() => {
              if (confirm(`「${item.shop}」の記録を削除しますか？`)) {
                onDelete(item.id);
              }
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </li>
      ))}
    </ul>
  );
}

export default HistoryView;
