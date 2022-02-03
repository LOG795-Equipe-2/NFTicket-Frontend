import { Autocomplete, TextField } from "@mui/material";
import { Box } from "@mui/material";
import "./Navigation.scss";

function Navigation() {
  return (
    <Box sx={{ bgcolor: 'primary.dark' }} className="navbar">
      <div className="navbar__left">
        <Box className="page-title" sx={{ color: 'secondary.main' }}>NFTicket</Box>
        <Box className="navbar__left__searchBox">
          <Autocomplete
            id="navbar-autocomplete"
            freeSolo
            options={[]}
            renderInput={(params) => <TextField {...params} label="Trouver un évenement..."/>}
          />
        </Box>
      </div>
      <div className="navbar__right">right</div>
    </Box>
  );
}

export default Navigation;
