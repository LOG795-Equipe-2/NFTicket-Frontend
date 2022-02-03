import { TextField } from "@mui/material";
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
      '& .MuiButtonBase-root': {
        color: theme.palette.secondary.main,
        paddingRight: 0
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
              )
            }}
          />
        </Box>
      </div>
      <div className="navbar__right">right</div>
    </Box>
  );
}

export default Navigation;
