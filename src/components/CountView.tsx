import { useMemo } from "react";
import dayjs from "dayjs";
import Emoji from "./Emoji";
import type { RamenRecord } from "../types";

function CountView({ history }: { history: RamenRecord[] }) {
  // 最終来店日からの経過日数。記録が無ければ null
  const days = useMemo(() => {
    if (history.length === 0) return null;
    // date は YYYY-MM-DD 固定なので辞書順の最大＝最新
    const latest = history.reduce(
      (max, item) => (item.date > max ? item.date : max),
      history[0].date
    );
    return dayjs().startOf("day").diff(dayjs(latest).startOf("day"), "day");
  }, [history]);

  return (
    <p className="LastRamen">
      {days === null ? (
        <>
          まだ記録がありません <Emoji days={days} />
        </>
      ) : days <= 0 ? (
        <>
          今日ラーメンを食べました <Emoji days={days} />
        </>
      ) : (
        <>
          ラーメンに行ってから
          <strong>{days}日</strong>
          が経過しました <Emoji days={days} />
        </>
      )}
    </p>
  );
}

export default CountView;
