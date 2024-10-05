import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from "@mui/material";
import React from "react";

interface DeleteDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, title, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this {title}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} variant="contained" color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;