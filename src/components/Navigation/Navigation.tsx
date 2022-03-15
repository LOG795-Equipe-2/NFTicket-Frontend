import { Button, Link, TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { ConfirmationNumber, Search } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import "./Navigation.scss";
import { AppwriteContext } from "../../App";


function Navigation() {
  const CssTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputLabel-root": {
      color: alpha(theme.palette.primary.light, 0.5),
    },
    "& .MuiOutlinedInput-root": {
      "& .MuiButtonBase-root": {
        color: theme.palette.secondary.main,
      },
      "& .MuiOutlinedInput-input": {
        color: theme.palette.primary.light,
      },
      "& fieldset": {
        borderColor: theme.palette.primary.light,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.light,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.secondary.main,
      },
    },
  }));
  const CssLink = styled(Link)(({ theme }) => ({
    "&.MuiLink-root": {
      color: theme.palette.secondary.main,
      "&:hover": {
        color: theme.palette.primary.light,
      },
    },
  }));
  return (
    <Box sx={{ bgcolor: "primary.dark" }} className="navbar">
      <div className="navbar__left">
        <Link href="/" underline="none">
          <Box className="page-title" sx={{ color: "secondary.main" }}>
            <ConfirmationNumber
              sx={{ marginRight: "10px" }}
            ></ConfirmationNumber>
            NFTicket
          </Box>
        </Link>

        <Box className="navbar__left__searchBox">
          <CssTextField
            fullWidth
            size="small"
            color="secondary"
            label="Trouver un événement..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </div>
      <div className="navbar__right">
        <div className="navbar__right__my-tickets">
          <CssLink href="tickets" underline="none">
            Mes billets
            <BookOnlineOutlinedIcon></BookOnlineOutlinedIcon>
          </CssLink>
          
        </div>
        <div className="navbar__right__login">
          <AppwriteContext.Consumer>
            {
              value => { return typeof(value.userLoggedIn?.username) == "undefined" ? 
                <CssLink href="signIn" underline="none">
                  Connexion/Inscription
                  <AccountCircleOutlinedIcon></AccountCircleOutlinedIcon>
                </CssLink>
                :
                <div>{value.userLoggedIn.username}</div>
            }}
            
          </AppwriteContext.Consumer>
        </div>
        <div>
          <AppwriteContext.Consumer>
            {
              value => { return <Button onClick={() => value.AuthServiceObject.logout().then(() => { value.setUserLoggedIn(undefined); }) }>Logout</Button>
            }}
            
          </AppwriteContext.Consumer>
        </div>
      </div>
    </Box>
  );
}

export default Navigation;
