import { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppwriteContext } from '../../App';
import { Navigate, useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from '@mui/material';
import { SnackbarMessage } from "../../interfaces/MUIIntefaces";

const theme = createTheme();

export default function SignIn() {
  let navigate = useNavigate();
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<SnackbarMessage | undefined>(undefined);

  const contextObject = useContext(AppwriteContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorEmail("");
    setErrorPassword("");
    setSnackbarContent(undefined)
    const data = new FormData(event.currentTarget);

    const email: string = data.get('email') as string;
    const password: string = data.get('password') as string;

    login(email, password);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsFetching(true);
      const session = await contextObject.AuthServiceObject.loginWithPassword(email, password);
      setIsFetching(false);

      contextObject.setUserLoggedIn({
        userId: contextObject.AuthServiceObject.account?.$id,
        username: contextObject.AuthServiceObject.account?.name,
        isLoggedInAnchor: contextObject.AuthServiceObject.isWalletLoggedIn(),
      })
      if (session)
        navigate("/");
    } catch (e: any) {
      setIsFetching(false);
      const message: string = e.message as string;
      if (message.startsWith("Invalid email")) {
        setErrorEmail(message);
      } else if (message.startsWith("Invalid password")) {
        setErrorPassword(message);
      } else {
        setSnackbarContent({type: "error", message})
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!snackbarContent} autoHideDuration={6000} onClose={() => setSnackbarContent(undefined)}>
        {snackbarContent && (
          <Alert onClose={() => setSnackbarContent(undefined)} severity={snackbarContent.type}>{snackbarContent.message}</Alert>
        )}
      </Snackbar>
      <AppwriteContext.Consumer>
        {value => {
          return !value.userLoggedIn?.isFetchingAppwrite && value.userLoggedIn?.username !== undefined && (
            <Navigate to="/" />
          )
        }}
      </AppwriteContext.Consumer>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            S'identifier
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse courriel"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!errorEmail}
              helperText={errorEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errorPassword}
              helperText={errorPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Mot de passe oublié?
                </Link>
              </Grid>
              <Grid item>
                <Link href="sign-up" variant="body2">
                  {"Vous n'avez pas de compte? S'inscrire"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}