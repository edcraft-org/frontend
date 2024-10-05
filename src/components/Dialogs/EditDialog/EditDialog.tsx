import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import React from "react";

interface EditDialogProps {
  open: boolean;
  title: string;
  value: string;
  onClose: () => void;
  onSave: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, title, value, onClose, onSave, onChange }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit {title}</DialogTitle>
      <DialogContent>
        <TextField
          value={value}
          onChange={onChange}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;