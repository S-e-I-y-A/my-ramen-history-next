import { useRef, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Rating,
  TextField,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { normalize } from "../storage";
import type { RamenRecord } from "../types";

const EXPORT_FILENAME = "ramen_history.json";

function Editor({
  onAdd,
  onReplaceAll,
}: {
  onAdd: (record: Omit<RamenRecord, "id">) => void;
  onReplaceAll: (records: RamenRecord[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [shop, setShop] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [rating, setRating] = useState<number | null>(2.5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 保存処理
  const handleSave = () => {
    if (!shop.trim() || !date || rating === null) {
      alert("すべての項目を入力してください");
      return;
    }
    onAdd({
      shop: shop.trim(),
      date: date.format("YYYY-MM-DD"),
      rating,
    });
    setShop("");
    setDate(dayjs());
    setRating(2.5);
    setOpen(false);
  };

  // エクスポート処理
  // iOS のホーム画面アプリ（standalone）では a[download] が無視されるため、
  // 共有シート（Web Share API）が使える場合はそちらを優先する。
  const handleExport = async () => {
    const data = localStorage.getItem("data");
    if (!data) {
      alert("エクスポートするデータがありません");
      return;
    }

    const file = new File([data], EXPORT_FILENAME, {
      type: "application/json",
    });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "My Ramen History" });
        return;
      } catch (err) {
        // ユーザーが共有シートを閉じただけなら何もしない
        if (err instanceof DOMException && err.name === "AbortError") return;
        // それ以外は下のダウンロードにフォールバック
      }
    }

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = EXPORT_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // インポート処理
  const handleImportFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    // 同じファイルを続けて選び直せるように値をリセットしておく
    e.target.value = "";
    if (!file) return;

    try {
      const records = normalize(JSON.parse(await file.text()));
      if (!records) {
        alert("不正なファイル形式です");
        return;
      }
      if (
        !confirm(
          `現在の記録をすべて置き換えて、${records.length}件を読み込みます。よろしいですか？`
        )
      ) {
        return;
      }
      onReplaceAll(records);
      alert("インポートが完了しました");
    } catch {
      alert("ファイルの読み込みに失敗しました");
    }
  };

  return (
    <>
      <Box className="toolbar">
        <Fab
          variant="extended"
          color="primary"
          aria-label="記録を追加"
          onClick={handleOpen}
        >
          <AddIcon sx={{ mr: 1 }} />
          追加
        </Fab>
        <Fab
          size="medium"
          aria-label="ファイルから読み込む"
          onClick={() => fileInputRef.current?.click()}
        >
          <SystemUpdateAltIcon />
        </Fab>
        <Fab size="medium" aria-label="書き出す" onClick={handleExport}>
          <ShareIcon />
        </Fab>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleImportFile}
        />
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: 1,
              background: "#fff8f0",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#0093d1",
            letterSpacing: "0.1em",
            pb: 0,
          }}
        >
          新規記録
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            mb: 1,
          }}
        >
          <TextField
            id="add_shop"
            label="店名"
            variant="outlined"
            fullWidth
            value={shop}
            onChange={(e) => setShop(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="日付"
              value={date}
              onChange={setDate}
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <span style={{ color: "#0093d1", fontWeight: "bold" }}>評価</span>
            <Rating
              name="rating"
              value={rating}
              precision={0.5}
              onChange={(_, newValue) => setRating(newValue)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: "#13c0ff",
              fontWeight: "bold",
              borderRadius: 2,
              px: 4,
              "&:hover": { background: "#0e9fd8" },
            }}
          >
            保存
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            sx={{ fontWeight: "bold", borderRadius: 2, px: 4 }}
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Editor;
