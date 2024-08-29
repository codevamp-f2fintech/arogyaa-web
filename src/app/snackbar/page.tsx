"use client";

import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { closeSnackbar } from "../../redux/features/snackbarSlice";

const SnackbarComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: RootState) => state.snackbar
  );

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
