
import React from "react";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navigation from "./components/Navigation/Navigation";
import Theme from "./theme.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import EventCreator from './components/EventCreator/EventCreator';
import AnchorTests from "./components/AnchorTests/AnchorTests";
import EventView from "./components/EventView/EventView";


const theme = createTheme(Theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navigation></Navigation>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tickets">tickets</Route>
            <Route path="/login">login</Route>
            <Route path="/create" element={<EventCreator />} />
            <Route path="/testAnchor" element={<AnchorTests />}>AnchorTest</Route>
            <Route path="/events/:id" element={<EventView />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
} export default App;
