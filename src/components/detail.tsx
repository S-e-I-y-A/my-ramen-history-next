//Detail.tsx
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  Stack,
} from "@mui/material";

// それぞれの場所の写真と詳細を表示できるようなポップアップ表示用の.tsx

function Detail() {
  const [open, setOpen] = useState(false);
  <Button onClick={() => setOpen(true)}>詳細表示</Button>;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>詳細表示</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="error">
          詳細
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default Detail;
