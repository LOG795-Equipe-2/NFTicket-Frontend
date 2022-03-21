
import React, { useEffect } from "react";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navigation from "./components/Navigation/Navigation";
import { BrowserRouter, Routes, Route, Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import Home from "./components/Home/Home";
import EventCreator from './components/EventCreator/EventCreator';
import AnchorTests from "./components/AnchorTests/AnchorTests";
import EventView from "./components/EventView/EventView";
import BuyTicketView from "./components/BuyTicketView/BuyTicketView";
import ListTicketView from "./components/ListTicketView/ListTicketView";
import SettingsView from "./components/SettingsView/SettingsView";
import UserTickets from './components/UserTickets/UserTickets';
import SignIn from "./components/Login/SignIn";
import SignUp from "./components/Login/SignUp";
import AuthServiceInstance, {AuthService} from "./services/AuthService";


const LinkBehavior = React.forwardRef<
  any,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  palette: {
    "primary": {
      "main": "#3F72AF",
      "dark": "#112D4E",
      "light": "#DBE2EF",
      "contrastText": "#F9F7F7"
    },
    "secondary": {
      "main": "#bb9c50",
      "light": "#b9994c"
    },
    "success": {
      "main": "#bb9c50",
      "contrastText": "#F9F7F7"
    }
  },
  components: {
    MuiLink: {
      defaultProps: {
        // NOTE: do not remove this works
        //@ts-ignore
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    }
  },
});

interface context {
  userLoggedIn: UserContext | undefined,
  setUserLoggedIn: any,
  AuthServiceObject: AuthService
}

interface UserContext {
  userId: string | undefined;
  username: string | undefined;
  isFetchingAppwrite: boolean
  isLoggedInAnchor: boolean;
  email: string | undefined;
}

export const AppwriteContext = React.createContext<context>(null!);

function App() {
  let [userLoggedIn, setUserLoggedIn] = React.useState<UserContext | undefined>({ 
    username: undefined,
    userId: undefined,
    isLoggedInAnchor: false,
    isFetchingAppwrite: true,
    email: undefined
   });

  useEffect(() => {
    AuthServiceInstance.checkForSession().then((sessionWasLoaded) => {
      if(sessionWasLoaded){
        console.log(AuthServiceInstance.account)
        setUserLoggedIn({
          userId: AuthServiceInstance.account?.$id,
          username: AuthServiceInstance.account?.name,
          isLoggedInAnchor: AuthServiceInstance.isWalletLoggedIn(),
          isFetchingAppwrite: false,
          email: AuthServiceInstance.account?.email
        });
      } else {
        setUserLoggedIn({
          userId: undefined,
          username: undefined,
          isLoggedInAnchor: false,
          isFetchingAppwrite: false,
          email: undefined
        })
      }
    })
  }, [])

  return (
    <AppwriteContext.Provider value={{
        userLoggedIn: userLoggedIn,
        setUserLoggedIn: setUserLoggedIn,
        AuthServiceObject: AuthServiceInstance
      }
    }>
      <ThemeProvider theme={theme}>
        <div className="App">
          <BrowserRouter>
            <Navigation></Navigation>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user_data" element={<ListTicketView />}>tickets</Route>
              <Route path="/tickets" element={<UserTickets/>}></Route>
              <Route path="/sign-in" element={<SignIn/>}></Route>
              <Route path="/sign-up" element={<SignUp/>}></Route>
              <Route path="/settings" element={<SettingsView />}></Route>
              <Route path="/create" element={<EventCreator />} />
              <Route path="/testAnchor" element={<AnchorTests />}>AnchorTest</Route>
              <Route path="/events/:id" element={<EventView />} />
              <Route path="/events/:id/buy/:ticketId" element={<BuyTicketView/>}/>
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AppwriteContext.Provider>

  );
} export default App;
