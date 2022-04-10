import { useContext, useState } from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppwriteContext } from '../../App';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import { SnackbarMessage } from '../../interfaces/MUIIntefaces';
import { Navigate, useNavigate } from "react-router-dom";
//export {}


const theme = createTheme();

export default function SignUp() {

  const navigate = useNavigate();

  const context = useContext(AppwriteContext);

  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<SnackbarMessage | undefined>(undefined);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorEmail("");
    setErrorPassword("");
    setSnackbarContent(undefined)

    const data = new FormData(event.currentTarget);
    
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const firstName = data.get('firstName') as string;
    const lastName = data.get('lastName') as string;

    if(firstName === "" || lastName === "") {
      setSnackbarContent({type: "error", message: "Invalid name"})
    } else {
      signUp(firstName, lastName, email, password)
    }
  };

  const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setIsFetching(true);
      const session = await context.AuthServiceObject.createAccount(email, password, firstName, lastName);
      setIsFetching(false);

      context.setUserLoggedIn({
        userId: context.AuthServiceObject.account?.$id,
        username: context.AuthServiceObject.account?.name,
        isLoggedInAnchor: context.AuthServiceObject.isWalletLoggedIn(),
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
          S'inscrire
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Prénom"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nom"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Adresse courriel"
                  name="email"
                  autoComplete="email"
                  error={!!errorEmail}
                  helperText={errorEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!errorPassword}
                  helperText={errorPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              S'inscrire
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="sign-in" variant="body2">
                Vous avez déjà un compte? Identifiez-vous 
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>        
      </Container>
    </ThemeProvider>
  );
}