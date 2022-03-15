
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
import BuyTicketView from "./components/BuyTicketView/BuyTicketView";
import ListTicketView from "./components/ListTicketView/ListTicketView";
import LoginView from "./components/LoginView/LoginView";
import UserTickets from './components/UserTickets/UserTickets';

const theme = createTheme(Theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navigation></Navigation>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user_data" element={<ListTicketView />}>tickets</Route>
            <Route path="/tickets" element={<UserTickets/>}></Route>
            <Route path="/login" element={<LoginView />}>login</Route>
            <Route path="/create" element={<EventCreator />} />
            <Route path="/testAnchor" element={<AnchorTests />}>AnchorTest</Route>
            <Route path="/events/:id" element={<EventView />} />
            <Route path="/events/:id/buy/:ticketId" element={<BuyTicketView/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
} export default App;
