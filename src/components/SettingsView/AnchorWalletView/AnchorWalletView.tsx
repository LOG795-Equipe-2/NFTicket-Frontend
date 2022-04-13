import {
  styled,
  Box,
  CircularProgress,
  Button,
  Typography,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { AppwriteContext } from "../../../App";
import { useContext } from "react";
import AnchorIcon from "@mui/icons-material/Anchor";
import { Navigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckIcon from '@mui/icons-material/Check';
import React from "react";
import { SnackbarMessage } from "../../../interfaces/MUIIntefaces";

const CssBox = styled(Box)(({ theme }) => ({
  ".AnchorWalletView": {},
}));

export default function AnchorWalletView(props: { snackbarContent: SnackbarMessage }) {
  const context = useContext(AppwriteContext);
  const [snackbarContent, setSnackbarContent] = React.useState<SnackbarMessage | undefined>(props.snackbarContent);

  const unlinkAnchor = () => {
    console.log("in unlinkAnchor");
    context.AuthServiceObject.logoutWallet()
      .then((logoutSuccessful: boolean) => {
        context.setUserLoggedIn({
          ...context.userLoggedIn,
          isLoggedInAnchor: false,
        });
      })
      .catch((err) => {
        console.log("Error while unlinking Anchor: " + err);
        context.setUserLoggedIn({
          ...context.userLoggedIn,
          isLoggedInAnchor: false,
        });
      });
  };

  const linkAnchor = () => {
    context.AuthServiceObject.loginWallet()
      .then((isLoggedInWallet: boolean) => {
        context.setUserLoggedIn({
          ...context.userLoggedIn,
          isLoggedInAnchor: isLoggedInWallet,
        });
      })
      .catch((err) => {
        console.log("Error while login to anchor: " + err);
        context.setUserLoggedIn({
          ...context.userLoggedIn,
          isLoggedInAnchor: false,
        });
      });
  };
  return (
    <CssBox className="AnchorWalletView">
      <Snackbar open={!!snackbarContent} autoHideDuration={6000} onClose={() => setSnackbarContent(undefined)}>
        {snackbarContent && (
          <Alert onClose={() => setSnackbarContent(undefined)} severity={snackbarContent.type}>{snackbarContent.message}</Alert>
        )}
      </Snackbar>
      <AppwriteContext.Consumer>
        {(value) => {
          return value.userLoggedIn?.isFetchingAppwrite ? (
            <CircularProgress size="25" />
          ) : value.userLoggedIn?.username === undefined ? (
            <Navigate to="/" />
          ) : (
            <Stack direction="column" spacing={4} alignItems="center">
              {context.userLoggedIn?.isLoggedInAnchor ? (
                <React.Fragment>
                  <Typography sx={{ display: 'flex', alignItems: 'center' }} color="primary.dark" variant="h5">Vous êtes connecté à Anchor Wallet en tant que&nbsp;<b>{value.AuthServiceObject.getWalletUserName().toString()}</b> <CheckIcon sx={{ marginLeft: '5px' }} color="success" /></Typography>
                  <Button
                    sx={{ width: 300 }}
                    variant="outlined"
                    onClick={unlinkAnchor}
                  >
                    Déconnexion d'Anchor{" "}
                    <AnchorIcon sx={{ marginLeft: "10px" }} />
                  </Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Paper elevation={1} sx={{ padding: "15px" }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <InfoOutlinedIcon color="primary" />
                      <Stack direction="column">
                        <Typography variant="subtitle1">
                          Vous pouvez vous connecter à votre compte Anchor pour
                          faire vos transactions.
                        </Typography>
                        <Typography variant="subtitle1">
                          Ce compte sera utilisé pour faire vos{" "}
                          <b>transactions</b> et voir vos <b>billets NFT</b>.
                        </Typography>
                        <Typography variant="subtitle1">
                          Le système se souviendra uniquement du dernier
                          appareil auquel vous vous être connecté.
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                  <Button
                    sx={{ width: 300 }}
                    variant="contained"
                    onClick={linkAnchor}
                  >
                    Connexion à Anchor{" "}
                    <AnchorIcon sx={{ marginLeft: "10px" }} />
                  </Button>
                </React.Fragment>
              )}
            </Stack>
          );
        }}
      </AppwriteContext.Consumer>
    </CssBox>
  );
}
