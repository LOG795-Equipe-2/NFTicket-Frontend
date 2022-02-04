import { Link, TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { ConfirmationNumber, Search } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import "./Navigation.scss";

function Navigation() {
  const CssTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputLabel-root": {
      color: alpha(theme.palette.primary.light, 0.5),
    },
    "& .MuiOutlinedInput-root": {
      "& .MuiButtonBase-root": {
        color: theme.palette.secondary.main
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
    }
  }));
  const CssLink = styled(Link)(({theme}) => ({
    "&.MuiLink-root": {
      color: theme.palette.secondary.main,
      "&:hover": {
        color: theme.palette.primary.light
      }
    }
  }));
  return (
    <Box sx={{ bgcolor: "primary.dark" }} className="navbar">
      <div className="navbar__left">
        <Box className="page-title" sx={{ color: "secondary.main" }}>
          <ConfirmationNumber sx={{ marginRight: "10px" }}></ConfirmationNumber>
          NFTicket
        </Box>
        <Box className="navbar__left__searchBox">
          <CssTextField
            fullWidth
            size="small"
            color="secondary"
            label="Trouver un évenement..."
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
        <div className="navbar__right__my_tickets">
          <CssLink href="tickets" underline="none">
            Mes billets
          </CssLink>
          <CssLink href="login" underline="none">
            Connexion/Inscription
          </CssLink>
        </div>
      </div>
    </Box>
  );
}

export default Navigation;
