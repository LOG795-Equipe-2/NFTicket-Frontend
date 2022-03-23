import { styled, Box, CircularProgress, Button, Typography, Paper, Stack } from "@mui/material";
import { AppwriteContext } from '../../../App';
import { useContext } from "react";
import AnchorIcon from '@mui/icons-material/Anchor';
import { Navigate } from "react-router-dom";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CssBox = styled(Box)(({ theme }) => ({
  ".AnchorWalletView": {

  }
}));

export default function AnchorWalletView() {
  const context = useContext(AppwriteContext);
  const unlinkAnchor = () => {
    console.log("in unlinkAnchor");
    context.AuthServiceObject.logoutWallet().then((logoutSuccessful: boolean) => {
      context.setUserLoggedIn({
        ...context.userLoggedIn,
        isLoggedInAnchor: false
      })
    }).catch((err) => {
      console.log("Error while unlinking Anchor: " + err);
      context.setUserLoggedIn({
        ...context.userLoggedIn,
        isLoggedInAnchor: false
      })
    });
  }

  const linkAnchor = () => {
    context.AuthServiceObject.loginWallet().then((isLoggedInWallet: boolean) => {
      context.setUserLoggedIn({
        ...context.userLoggedIn,
        isLoggedInAnchor: isLoggedInWallet
      })
    }).catch((err) => {
      console.log("Error while login to anchor: " + err);
      context.setUserLoggedIn({
        ...context.userLoggedIn,
        isLoggedInAnchor: false
      })
    });
  }
  return (
    <CssBox className="AnchorWalletView">
      <AppwriteContext.Consumer>
        {
          value => {
            return value.userLoggedIn?.isFetchingAppwrite ? (
              <CircularProgress size="25" />
            ) : value.userLoggedIn?.username === undefined ? (
              <Navigate to="/" />
            ) : (
              <Stack direction="column" spacing={4} alignItems="center">
                <Paper elevation={1} sx={{ padding: '15px' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <InfoOutlinedIcon color="primary" />
                    <Stack direction="column">
                      <Typography variant="subtitle1">Vous pouvez vous connecter à votre compte Anchor pour faire vos transactions.</Typography>
                      <Typography variant="subtitle1">Ce compte sera utilisé pour faire vos <b>transactions</b> et voir vos <b>billets NFT</b>.</Typography>
                      <Typography variant="subtitle1">Le système se souviendra uniquement du dernier appareil auquel vous vous être connecté.</Typography>
                    </Stack>
                  </Stack>
                </Paper>

                {context.userLoggedIn?.isLoggedInAnchor ?
                  <Button sx={{ width: 300 }} variant="outlined" onClick={unlinkAnchor}>Déconnexion d'Anchor <AnchorIcon sx={{ marginLeft: '10px' }} /></Button> :
                  <Button sx={{ width: 300 }} variant="contained" onClick={linkAnchor}>Connexion à Anchor <AnchorIcon sx={{ marginLeft: '10px' }} /></Button>
                }
              </Stack>
            )
          }
        }
      </AppwriteContext.Consumer>
    </CssBox>
  );
};