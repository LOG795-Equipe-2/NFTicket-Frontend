import { Avatar, Box, CircularProgress, Stack, styled, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import './ProfileView.scss';
import { AppwriteContext } from '../../../App';
import { Navigate } from "react-router-dom";
import React from "react";
import { SnackbarMessage } from "../../../interfaces/MUIIntefaces";

const CssBox = styled(Box)(({ theme }) => ({
  ".ProfileView": {
    "&__summary": {
      ".MuiAvatar-root": {
        backgroundColor: theme.palette.primary.main,
        fontSize: '1.5rem'
      },
    },
    "&__reset-password": {
      "input": {
        width: '200px'
      }
    }
  }
}));

export default function ProfileView() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [snackbarContent, setSnackbarContent] = React.useState<SnackbarMessage | undefined>(undefined);
  const contextObject = React.useContext(AppwriteContext);

  const handleResetPasswordSubmit = (e: any, { currentPassword, newPassword, confirmPassword }: { currentPassword: string, newPassword: string, confirmPassword: string }) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSnackbarContent({ type: "error", message: "Erreur: le nouveau mot de passe et la confirmation ne correspondent pas" })
    } else {
      contextObject.AuthServiceObject.changePassword(currentPassword, newPassword).then(response => {
        setSnackbarContent({ type: "success", message: "Le mot de passe a été mis à jour avec succès!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
        .catch(error => {
          if (error.message === "Invalid credentials") {
            setSnackbarContent({ type: "error", message: "Erreur: le mot de passe entré est erroné" })
          } else if (error.message === "Invalid password: Password must be at least 8 characters") {
            setSnackbarContent({ type: "error", message: "Erreur: le nouveau mot de passe doit contenir au moins 8 caractères" })
          } else {
            setSnackbarContent({ type: "error", message: "Erreur lors de la mise à jour du mot de passe" })
          }
        });
    }
  }



  return (
    <AppwriteContext.Consumer>
      {
        value => {
          return value.userLoggedIn?.isFetchingAppwrite ? (
            <CircularProgress size={25} />
          ) : ((value.userLoggedIn?.username === undefined) ? (
            <Navigate to="/" />
          ) : (
            <CssBox className="ProfileView">
              <Snackbar open={!!snackbarContent} autoHideDuration={6000} onClose={() => setSnackbarContent(undefined)}>
                {snackbarContent && (
                  <Alert onClose={() => setSnackbarContent(undefined)} severity={snackbarContent.type}>{snackbarContent.message}</Alert>
                )}
              </Snackbar>
              <Stack direction="column" spacing={4}>
                <Stack className="ProfileView__summary" alignItems="center" spacing={4} direction="row">
                  <Avatar sx={{ width: 80, height: 80 }}>{value.userLoggedIn.username.split(" ").map(n => n.charAt(0)).join(" ")}</Avatar>
                  <Stack spacing={0} direction="column">
                    <Typography color="primary.dark" variant="h4">{value.userLoggedIn.username}</Typography>
                    <Typography color="text.secondary" variant="body2">{value.userLoggedIn.email}</Typography>
                  </Stack>
                </Stack>
                <Stack className="ProfileView__reset-password" component="form" onSubmit={(e: any) => handleResetPasswordSubmit(e, { currentPassword, newPassword, confirmPassword })} direction="column" spacing={2}>
                  <Typography color="primary.dark" variant="h5">Réinitialiser le mot de passe</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField onChange={(e) => setCurrentPassword(e.target.value)} value={currentPassword} name="current-password" required autoComplete="current-password" type="password" label="Ancien mot de passe" />
                    <TextField onChange={(e) => setNewPassword(e.target.value)} value={newPassword} name="new-password" required autoComplete="new-password" type="password" label="Nouveau mot de passe" />
                    <TextField onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} name="confirm-password" required autoComplete="new-password" type="password" label="Confirmer le nouveau mot de passe" />
                  </Stack>
                  <Stack direction="row" justifyContent="center"><Button variant="contained" sx={{ width: 200 }} type="submit">Réinitialiser</Button></Stack>
                </Stack>
              </Stack>

            </CssBox>
          ))
        }
      }

    </AppwriteContext.Consumer>

  )
}