import { Badge, Button, CircularProgress, Divider, Link, ListItemIcon, ListItemText, Menu, MenuItem, TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { ConfirmationNumber, Search } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import "./Navigation.scss";
import { AppwriteContext } from "../../App";
import React from "react";


function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpenClick = (event: any) => {
    setAnchorEl(event.target.parentElement)
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = (appwriteContext: any) => {
    appwriteContext.setUserLoggedIn({ isFetchingAppwrite: true });
    appwriteContext.AuthServiceObject.logout().then(() => { appwriteContext.setUserLoggedIn({ isFetchingAppwrite: false, username: undefined, userid: undefined }); })
    setAnchorEl(null);
  }
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
  const NavbarItem = styled(Box)(({ theme }) => ({
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.primary.light
    }
  }));
  const NavbarMenu = styled(Menu)(({ theme }) => ({
    ".MuiLink-root": {
      color: theme.palette.primary.dark,
      ".MuiBadge-badge": {
        right: '-8px',
        top: '3px'
      }
    }
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


        <AppwriteContext.Consumer>
          {
            value => {
              return value.userLoggedIn?.isFetchingAppwrite ? (
                <Box className="loading">
                  <CircularProgress color="secondary" size={25} />
                </Box>
              ) : (typeof (value.userLoggedIn?.username) == "undefined" ?
                <div className="navbar__right__login">
                  <CssLink href="sign-in" underline="none">
                    Connexion/Inscription
                    <AccountCircleOutlinedIcon></AccountCircleOutlinedIcon>
                  </CssLink>
                </div>
                :
                <React.Fragment>
                  <div className="navbar__right__my-tickets">
                    <CssLink href="tickets" underline="none">
                      Mes billets
                      <BookOnlineOutlinedIcon></BookOnlineOutlinedIcon>
                    </CssLink>

                  </div>
                  <div className="navbar__right__login">
                    <NavbarItem
                      id="menu-button"
                      className={`navbar-item ${menuOpen && "open"}`}
                      aria-controls={menuOpen ? 'navbar-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={menuOpen ? 'true' : undefined}
                      color="secondary"
                      onClick={handleMenuOpenClick}>
                      {value.userLoggedIn?.username}
                      <ArrowDropDownIcon />
                    </NavbarItem>
                    <NavbarMenu
                      id="navbar-menu"
                      open={menuOpen}
                      anchorEl={anchorEl}
                      MenuListProps={{
                        'aria-labelledby': 'menu-button'
                      }}
                      onClose={handleMenuClose}
                      sx={{
                        marginLeft: '10px',
                        marginTop: '10px'
                      }}
                    >
                      <MenuItem>
                        <Link href="settings" underline="none" onClick={handleMenuClose}>
                          <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                          <ListItemText>
                            {value.userLoggedIn && !value.userLoggedIn?.isLoggedInAnchor ? (
                              <Badge variant="dot" color="error">Paramètres</Badge>
                            ) : "Paramètres"}

                          </ListItemText>
                        </Link>

                      </MenuItem>
                      <MenuItem>
                        <Link href="create" underline="none" onClick={handleMenuClose}>
                          <ListItemIcon><ConfirmationNumber color="primary" /></ListItemIcon>
                          <ListItemText>Créer un événement</ListItemText>
                        </Link>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => handleLogout(value)}>
                        <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                        <ListItemText>Déconnexion</ListItemText>
                      </MenuItem>
                    </NavbarMenu>
                  </div>
                </React.Fragment>
              )
            }}

        </AppwriteContext.Consumer>
      </div>
    </Box >
  );
}

export default Navigation;
