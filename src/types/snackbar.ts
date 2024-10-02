import { AlertColor } from "@mui/material/Alert";

export interface Snackbar {
  snackbarAlert: boolean;
  snackbarSeverity: AlertColor;
  snackbarMessage: string;
}
