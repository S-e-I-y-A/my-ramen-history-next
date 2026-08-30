import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { RamenRecord } from "../types";

// 一覧から1件タップしたときの詳細。感想はここで後から書き足せる。
// TODO: トッピング / 何系 / 金額 を記録できるようにする

function Detail({
  record,
  onUpdateMemo,
  onClose,
}: {
  record: RamenRecord | null;
  onUpdateMemo: (id: string, memo: string) => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const recordId = record?.id ?? null;
  const memo = record?.memo ?? "";

  // 別の記録を開いたら編集状態を捨てる
  useEffect(() => {
    setEditing(false);
    setDraft(memo);
  }, [recordId, memo]);

  const handleSave = () => {
    if (record) onUpdateMemo(record.id, draft.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(memo);
    setEditing(false);
  };

  return (
    <Dialog
      open={record !== null}
      // 編集中に背景をタップして書きかけを失わないようにする
      onClose={editing ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>{record?.shop ?? ""}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="body2" color="text.secondary">
              日付
            </Typography>
            <Typography variant="body1">{record?.date ?? ""}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              評価
            </Typography>
            <Rating value={record?.rating ?? 0} precision={0.5} readOnly />
          </Stack>

          {editing ? (
            <TextField
              label="感想"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              maxRows={10}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          ) : (
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                感想
              </Typography>
              <Typography
                variant="body1"
                color={memo ? "text.primary" : "text.disabled"}
                // 改行をそのまま見せる
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {memo || "まだ書いていません"}
              </Typography>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {editing ? (
          <>
            <Button onClick={handleCancel} color="inherit">
              取り消し
            </Button>
            <Button onClick={handleSave} variant="contained">
              保存
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setEditing(true)}>
              {memo ? "感想を編集" : "感想を書く"}
            </Button>
            <Button onClick={onClose} color="inherit">
              閉じる
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default Detail;
