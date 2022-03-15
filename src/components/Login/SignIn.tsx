import * as React from 'react';
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
import { useNavigate  } from "react-router-dom";

const theme = createTheme();

export default function SignIn() {
  let navigate = useNavigate();

  const contextObject = React.useContext(AppwriteContext);

  const [loggedInSuccess, setLoggedInSuccess] = React.useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email: string = data.get('email') as string;
    const password: string = data.get('password') as string;
    
    login(email, password);

    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const login = async (email: string, password: string) => {
    const session = await contextObject.AuthServiceObject.loginWithPassword(email, password);
    contextObject.setUserLoggedIn({
      userId: contextObject.AuthServiceObject.account?.$id,
      username: contextObject.AuthServiceObject.account?.name
    })
    if(session)
      navigate("/");
  }

  return (
    <ThemeProvider theme={theme}>
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
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Conserver la connexion"
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
                  Mot de passe oublier?
                </Link>
              </Grid>
              <Grid item>
                <Link href="signUp" variant="body2">
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