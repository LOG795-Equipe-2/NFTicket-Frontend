import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { Autocomplete, Box, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import "./SearchBox.scss";

function SearchBox() {
  const [dateValue, setDateValue] = React.useState<Date | null>(null);
  const [locationValue, setLocationValue] = React.useState<string | null>(null);
  const [keywordValue, setKeywordValue] = React.useState<string | null>(null);
  const today = new Date().toString();
  const handleDateChange = (newValue: string | null) => {
    if (newValue !== null) {
      setDateValue(new Date(newValue));
    }
  };
  return (
    <Box className="home-searchbox">
      <div className="home-searchbox__date">
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DesktopDatePicker
            label="Date"
            inputFormat="MM/yyyy"
            renderInput={(params) => <TextField {...params} />}
            onChange={handleDateChange}
            value={dateValue}
            views={["month", "year"]}
          />
        </LocalizationProvider>
      </div>
      <div className="home-searchbox__location">
        <Autocomplete
          value={locationValue}
          id="location-autocomplete"
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => <li {...props}>{option}</li>}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Ville/Province" />
          )}
          options={[]}
        />
      </div>
      <div className="home-searchbox__keyword">
        <Autocomplete
          value={locationValue}
          id="keyword-autocomplete"
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => <li {...props}>{option}</li>}
          freeSolo
          renderInput={(params) => <TextField {...params} label="Mot-clé" />}
          options={[]}
        />
      </div>
      <div className="home-searchbox__button">
        <Button color="info" variant="contained">
          <SearchIcon></SearchIcon>
        </Button>
      </div>
    </Box>
  );
}

export default SearchBox;
