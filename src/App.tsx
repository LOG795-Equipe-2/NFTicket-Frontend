
import React from "react";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navigation from "./components/Navigation/Navigation";
import Theme from "./theme.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import EventCreator from './components/EventCreator/EventCreator';

import AnchorBrowserManager from './utils/AnchorBrowserManager';

const theme = createTheme(Theme);

function performTransaction(manager: AnchorBrowserManager){
  try{
    manager.performTransactions([{
      account: 'addressbook',
          name: 'upsert',
          data:{
            user: 'alice',
            first_name: 'alice',
            last_name: 'liddell',
            age: 24,
            street: '123 drink me way',
            city: 'wonderland',
            state: 'amsterdam'
        }
      }, {
        account: 'addressbook',
        name: 'upsert',
        data:{
          user: 'alice',
          first_name: 'alice',
          last_name: 'liddell',
          age: 25,
          street: '123 drink me way',
          city: 'wonderland',
          state: 'amsterdam'
        }
      }]);

  } catch(err) {
    alert(err);
  }
}

function App() {
  const manager = new AnchorBrowserManager('184ba45492aeb666274a46d82d7b212c5a79d888b4e4b6da31449765770410bf', 'http://localhost:8888', 'NFTicket');
  
  // Try to restore the session at beginning.
  manager.restoreSession().then((value) => {
    console.log("restored: " + value)
  });
  

  return (
    <ThemeProvider theme={theme}>
      {/* <button onClick={() => manager.login()}>Login</button>
      <button onClick={() => performTransaction(manager)}>perform trx</button>
      <button onClick={() => manager.logout()}>logout</button> */}
      <div className="App">
        <Navigation></Navigation>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tickets">tickets</Route>
            <Route path="/login">login</Route>
            <Route path="/create" element={<EventCreator />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
} export default App;
