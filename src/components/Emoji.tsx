import Tooltip from "@mui/material/Tooltip";

// 最終来店からの経過日数に応じた顔。days は CountView から受け取る
function Emoji({ days }: { days: number | null }) {
  let icon = "❓";
  let label = "履歴が見つかりません";

  if (days === null) {
    icon = "❓";
    label = "履歴が見つかりません";
  } else if (days < 3) {
    icon = "🍜";
    label = "最近食べたね（余裕）";
  } else if (days < 7) {
    icon = "🙂";
    label = "まだ大丈夫";
  } else if (days < 14) {
    icon = "😢";
    label = "そろそろ行っておいたほうが良いかも";
  } else {
    icon = "😭";
    label = "禁断症状（至急ラーメン）";
  }

  return (
    <Tooltip title={label} arrow enterTouchDelay={0}>
      <span aria-label={label} role="img">
        {icon}
      </span>
    </Tooltip>
  );
}

export default Emoji;
