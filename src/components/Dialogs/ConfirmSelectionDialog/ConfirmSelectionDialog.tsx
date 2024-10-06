import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface ConfirmSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedRows: { id: number; question: string; answer: string }[];
  columns: GridColDef[];
}

const ConfirmSelectionDialog: React.FC<ConfirmSelectionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  selectedRows,
  columns,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Confirm Selection</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Selected Questions</Typography>
        <Paper sx={{ width: '100%', marginBottom: 2 }}>
          <DataGrid
            rows={selectedRows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            autoHeight
          />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmSelectionDialog;