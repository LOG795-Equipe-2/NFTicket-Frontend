import { AlertColor } from "@mui/material";

export interface SnackbarMessage {
    type: AlertColor;
    message: string;
}