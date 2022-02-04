import React from "react";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navigation from "./components/Navigation/Navigation";
import Theme from "./theme.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";

const theme = createTheme(Theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div title="NFTicket App" className="App">
          <Navigation></Navigation>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tickets">tickets</Route>
          <Route path="/login">login</Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
