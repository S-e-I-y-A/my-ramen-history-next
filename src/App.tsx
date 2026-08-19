import "./App.css";
import { useCallback, useEffect, useState } from "react";
import CountView from "./components/CountView";
import HistoryView from "./components/HistoryView";
import Editor from "./components/Editor";
import Detail from "./components/Detail";
import { loadHistory, newId, saveHistory } from "./storage";
import type { RamenRecord } from "./types";

function App() {
  const [history, setHistory] = useState<RamenRecord[]>([]);
  const [selected, setSelected] = useState<RamenRecord | null>(null);

  // 初回マウント時に localStorage から取得（旧形式はここで移行される）
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // state と localStorage を必ず同時に更新する唯一の入口
  const commit = useCallback((records: RamenRecord[]) => {
    setHistory(records);
    saveHistory(records);
  }, []);

  const handleAdd = useCallback(
    (record: Omit<RamenRecord, "id">) => {
      commit([...history, { ...record, id: newId() }]);
    },
    [commit, history]
  );

  const handleReplaceAll = useCallback(
    (records: RamenRecord[]) => {
      commit(records);
    },
    [commit]
  );

  const handleDelete = useCallback(
    (id: string) => {
      commit(history.filter((item) => item.id !== id));
      setSelected((current) => (current?.id === id ? null : current));
    },
    [commit, history]
  );

  return (
    <div className="app">
      <CountView history={history} />
      <Editor onAdd={handleAdd} onReplaceAll={handleReplaceAll} />
      <HistoryView
        history={history}
        onDelete={handleDelete}
        onSelect={setSelected}
      />
      <Detail record={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default App;
