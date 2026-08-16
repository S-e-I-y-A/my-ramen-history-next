import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import type { RamenRecord } from "../types";

// 一覧から1件タップしたときに詳細を表示するポップアップ
// TODO: トッピング / 感想 / 何系 / 金額 / 写真 を記録できるようにする

function Detail({
  record,
  onClose,
}: {
  record: RamenRecord | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={record !== null} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {record?.shop ?? ""}
      </DialogTitle>
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Detail;
