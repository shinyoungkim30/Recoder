import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function AlertDialog({ wh_seq }) {
  const [open, setOpen] = useState(false);
  const [existStock, setExistStock] = useState(false);
  const [deleteAgree, setDeleteAgree] = useState('')

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    setOpen(false);
    
    if (e.target.innerText === '삭제') {
      setDeleteAgree('삭제')
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/stock/stockcount/${wh_seq}`)
      .then((res) => {
        if (res.data > 1) {
          setExistStock(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [open]);

  useEffect(() => {
    if (deleteAgree === '삭제') {
      axios.delete(`http://localhost:8000/warehouse/${wh_seq}`)
      .then((res) => {
        window.location.href = 'http://localhost:3000/ware/manage'
      })
      .catch((err) => {
        console.error(err);
      })
    }
  }, [deleteAgree])

  return (
    <div style={{
      textAlign: "right"
    }}>
      <div id="ware-delete-button">
          <DeleteOutlineIcon />
          <button onClick={handleClickOpen}>창고 삭제</button>
      </div>
      {existStock ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"정말 삭제하시겠습니까?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              아직 출고되지 않은 상품이 있습니다
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>취소</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"정말 삭제하시겠습니까?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              정말 삭제하시겠습니까 이 작업은 되돌릴 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={(e) => handleClose(e)}>취소</Button>
            <Button onClick={(e) => handleClose(e)} autoFocus>
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
