import { useMemo } from "react";
import Emoji from "./Emoji";
import dayjs from "dayjs";

type HistoryItem = { shop: string; date: string; rating: string };

function CountView({ history }: { history: HistoryItem[] }) {
  const days = useMemo(() => {
    if (!history || history.length === 0) return null;
    const latest = history
      .map((item) => item.date)
      .sort((a, b) => dayjs(b).unix() - dayjs(a).unix())[0];
    return dayjs().diff(dayjs(latest), "day");
  }, [history]);

  return (
    <p className="LastRamen" style={{ color: "#fff" }}>
      {days === 0 ? (
        <>
          今日ラーメンを食べました <Emoji />
        </>
      ) : (
        <>
          ラーメンに行ってから
          <strong style={{ margin: "0 0.5em" }}>
            {days !== null ? `${days}日` : "--日"}
          </strong>
          が経過しました <Emoji />
        </>
      )}
    </p>
  );
}

export default CountView;
