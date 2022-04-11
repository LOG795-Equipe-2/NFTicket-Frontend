
import React, { useContext, useEffect } from "react";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navigation from "./components/Navigation/Navigation";
import { BrowserRouter, Routes, Route, Link as RouterLink, LinkProps as RouterLinkProps, Navigate } from "react-router-dom";
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
import themeJSON from './theme.json';
import AuthServiceInstance, { AuthService } from "./services/AuthService";
import { Backdrop, CircularProgress } from "@mui/material";
import WithNavbar from "./components/Wrapper/WithNavbar";
import ValidatorView from "./components/ValidatorView/ValidatorView";


const LinkBehavior = React.forwardRef<
  any,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  palette: themeJSON.palette,
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

const ProtectedRoute = (props: { needAnchor: boolean, children: any }) => {
  const context = useContext(AppwriteContext);
  if (context.userLoggedIn?.isFetchingAppwrite) {
    return <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={true} >
      <CircularProgress size={50} color="inherit" />
    </Backdrop>
  }

  if (!context.userLoggedIn?.isFetchingAppwrite && !context.AuthServiceObject.isLoggedIn()) {
    return <Navigate to="/sign-in" replace />;
  }

  if (props.needAnchor && !context.userLoggedIn?.isFetchingAppwrite && !context.AuthServiceObject.isWalletLoggedIn()) {
    return <Navigate to="/settings?page=anchor" replace />;
  }

  return props.children;
};

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
      if (sessionWasLoaded) {
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
            <Routes>
              <Route element={<WithNavbar />}>
                <Route path="/" element={<Home />} />
              </Route>
              <Route path="/user_data" element={<ListTicketView />}>tickets</Route>
              <Route element={<WithNavbar />}>
                <Route path="/tickets" element={
                  <ProtectedRoute needAnchor={true}>
                    <UserTickets />
                  </ProtectedRoute>}>
                </Route>
              </Route>
              <Route element={<WithNavbar />}>
                <Route path="/sign-in" element={<SignIn />}></Route>
              </Route>
              <Route element={<WithNavbar />}>
                <Route path="/sign-up" element={<SignUp />}></Route>
              </Route>
              <Route element={<WithNavbar />}>
                <Route path="/settings" element={<SettingsView />}></Route>
              </Route>
              <Route element={<WithNavbar />}>
                <Route path="/create" element={
                  <ProtectedRoute needAnchor={true}>
                    <EventCreator />
                  </ProtectedRoute>
                } />
              </Route>
              <Route path="/testAnchor" element={<AnchorTests />}>AnchorTest</Route>
              <Route element={<WithNavbar />}>
                <Route path="/events/:id" element={<EventView />} />
              </Route>
              <Route element={<WithNavbar />}>
                <Route path="/events/:id/buy/:ticketCategoryId" element={<BuyTicketView />} />
              </Route>  
              <Route path="/validator/:eventId/:id" element={<ValidatorView/>} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AppwriteContext.Provider>

  );
} export default App;
