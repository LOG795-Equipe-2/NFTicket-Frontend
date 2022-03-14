
import React from "react";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navigation from "./components/Navigation/Navigation";
import Theme from "./theme.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import AnchorTests from "./components/AnchorTests/AnchorTests";
import SignIn from "./components/Login/SignIn";
import SignUp from "./components/Login/SignUp";
import Recovery from "./components/Login/Recovery";
import SuccessSignUp from "./components/Login/SuccessSignUp";


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
            <Route path="/signIn" element={<SignIn/>}>signIn</Route>
            <Route path="/signUp" element={<SignUp/>}>signUp</Route>
            <Route path="/recovery" element={<Recovery/>}>recovery</Route>
            <Route path="/successSignUp" element={<SuccessSignUp/>}>successSignUp</Route>
            <Route path="/testAnchor" element={<AnchorTests/>}>AnchorTest</Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
} export default App;
