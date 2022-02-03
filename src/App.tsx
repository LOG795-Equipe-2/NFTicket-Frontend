import React from "react";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navigation from "./components/Navigation/Navigation";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3F72AF",
      dark: "#112D4E",
      light: "#DBE2EF",
      contrastText: "#F9F7F7",
    },
    secondary: {
      main: "#bb9c50",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div title="NFTicket App" className="App">
        <Navigation></Navigation>
      </div>
    </ThemeProvider>
  );
}

export default App;
