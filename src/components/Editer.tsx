import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Box, Fab, Button, TextField, Rating } from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

import { Dayjs } from "dayjs";

function Editer({
  onSave,
}: {
  onSave: (
    item:
      | { shop: string; date: string; rating: string }
      | { shop: string; date: string; rating: string }[]
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const [shop, setShop] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [rating, setRating] = useState<number | null>(2.5);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 保存処理
  const handleSave = () => {
    if (!shop || !date || !rating) {
      alert("すべての項目を入力してください");
      return;
    }
    const newItem = {
      shop,
      date: date.format("YYYY-MM-DD"),
      rating: rating.toString(),
    };
    onSave(newItem); // ← オブジェクトで渡す
    setShop("");
    setDate(null);
    setRating(2.5);
    setOpen(false);
    window.location.reload();
  };

  // エクスポート処理
  const handleExport = () => {
    const data = localStorage.getItem("data");
    if (!data) {
      alert("エクスポートするデータがありません");
      return;
    }

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ramen_history.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // インポート処理
  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        if (!Array.isArray(json)) {
          alert("不正なファイル形式です");
          return;
        }
        localStorage.setItem("data", JSON.stringify(json));
        onSave(json); // ← 配列で渡す
        alert("インポートが完了しました");
        window.location.reload(); // ← 追加
      } catch {
        alert("ファイルの読み込みに失敗しました");
      }
    };
    input.click();
  };

  return (
    <>
      <Box sx={{ m: 4, "& > :not(style)": { m: 1 } }}>
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          onClick={handleOpen}
        >
          <AddIcon sx={{ mr: 1 }} />
          追加
        </Fab>
        <Fab variant="extended" onClick={handleImport}>
          <SystemUpdateAltIcon sx={{ m: 1 }} />
        </Fab>
        <Fab variant="extended" onClick={handleExport}>
          <ShareIcon sx={{ m: 1 }} />
        </Fab>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            background: "#fff8f0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            minWidth: 340,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#00b3ffff",
            fontSize: "1.4rem",
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
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            mb: 1,
            px: 2,
          }}
        >
          <TextField
            id="add_shop"
            label="店名"
            variant="outlined"
            sx={{ width: "100%", maxWidth: 260 }}
            value={shop}
            onChange={(e) => setShop(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="日付"
              value={date}
              onChange={setDate}
              sx={{ width: "100%", maxWidth: 260 }}
            />
          </LocalizationProvider>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <span style={{ color: "#00b3ffff", fontWeight: "bold" }}>評価</span>
            <Rating
              name="half-rating"
              value={rating}
              precision={0.5}
              onChange={(_, newValue) => setRating(newValue)}
              sx={{ ml: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: "#13c0ff",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 2,
              px: 4,
              mr: 2,
              "&:hover": { background: "#0e9fd8" },
            }}
          >
            保存
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: "#090909ff",
              borderColor: "#000000ff",
              fontWeight: "bold",
              borderRadius: 2,
              px: 4,
              "&:hover": { background: "#fff3e0", borderColor: "#b35900" },
            }}
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Editer;
