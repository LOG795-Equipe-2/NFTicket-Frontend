import {
  Box,
  styled,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  Divider,
  CircularProgress,
  Badge,
} from "@mui/material";
import { AppwriteContext } from "../../App";
import { useEffect, useState, useContext } from "react";
import NFTicketTransactionServiceInstance, {
  NFTicketTransactionService,
} from "../../services/NFTicketTransactionService";
import AnchorIcon from '@mui/icons-material/Anchor';
import AccountCircleIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import './SettingsView.scss';
import { Navigate, useSearchParams } from "react-router-dom";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ProfileView from "./ProfileView/ProfileView";
import AnchorWalletView from "./AnchorWalletView/AnchorWalletView";
import MyEventsView from "./MyEventsView/MyEventsView";

let serviceNFT: NFTicketTransactionService;
enum SelectedTab {
  PROFILE,
  ANCHOR,
  MY_EVENTS,
}

function SettingsView(props: any) {
  const [selectedTab, setSelectedTab] = useState(SelectedTab.PROFILE);
  const CssBox = styled(Box)(({ theme }) => ({
    ".Settings": {
      "&__title": {
        color: theme.palette.primary.dark,
      },
      "&__content": {
        "&__menu": {
          ".MuiBadge-badge": {
            right: "-8px",
            top: "3px",
          },
        },
      },
    },
  }));

  const context = useContext(AppwriteContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [redirectReason, setRedirectReason] = useState<any>();

  const handleLogout = (appwriteContext: any) => {
    appwriteContext.setUserLoggedIn({ isFetchingAppwrite: true });
    appwriteContext.AuthServiceObject.logout().then(() => {
      appwriteContext.setUserLoggedIn({
        isFetchingAppwrite: false,
        username: undefined,
        userid: undefined,
      });
    });
  };

  useEffect(() => {
    const page = searchParams.get("page")
    switch(page) {
      case "anchor":
        setSelectedTab(SelectedTab.ANCHOR);
        setRedirectReason({type: "warning", message: "No Anchor account is linked to this account"})
      break;
      case "profile": setSelectedTab(SelectedTab.PROFILE);
      break;
    }
  }, []);

  const changeTab = (tab: SelectedTab) => {
    setRedirectReason(null);
    setSelectedTab(tab);
  }

  

  return (
    <CssBox className="Settings">
      <div className="Settings__title">Paramètres</div>
      <div className="Settings__content">
        <div className="Settings__content__menu">
          <Card>
            <List disablePadding={true}>
              <ListItem disablePadding={true}>
                <ListItemButton
                  selected={selectedTab === SelectedTab.PROFILE}
                  onClick={() => changeTab(SelectedTab.PROFILE)}
                >
                  <ListItemIcon>
                    <AccountCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText>Profil</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding={true}>
                <ListItemButton
                  selected={selectedTab === SelectedTab.ANCHOR}
                  onClick={() => changeTab(SelectedTab.ANCHOR)}
                >
                  <ListItemIcon>
                    <AnchorIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText>
                    <AppwriteContext.Consumer>
                      {(context) => {
                        return context.userLoggedIn &&
                          !context.userLoggedIn?.isLoggedInAnchor ? (
                          <Badge variant="dot" color="error">
                            Anchor Wallet
                          </Badge>
                        ) : (
                          "Anchor Wallet"
                        );
                      }}
                    </AppwriteContext.Consumer>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding={true}>
                <ListItemButton
                  selected={selectedTab === SelectedTab.MY_EVENTS}
                  onClick={() => changeTab(SelectedTab.MY_EVENTS)}
                >
                  <ListItemIcon>
                    <EventSeatIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText>Mes événements</ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <AppwriteContext.Consumer>
                {(value) => {
                  return value.userLoggedIn?.isFetchingAppwrite ? (
                    <ListItem
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <ListItemIcon>
                        <CircularProgress color="secondary" size={20} />
                      </ListItemIcon>
                    </ListItem>
                  ) : value.userLoggedIn?.username === undefined ? (
                    <Navigate to="/" />
                  ) : (
                    <ListItem disablePadding={true}>
                      <ListItemButton onClick={() => handleLogout(value)}>
                        <ListItemIcon>
                          <LogoutIcon color="error" />
                        </ListItemIcon>
                        <ListItemText>Déconnexion</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  );
                }}
              </AppwriteContext.Consumer>
            </List>
          </Card>
        </div>
        <div className="Settings__content__window">
          {selectedTab === SelectedTab.PROFILE && <ProfileView />}
          {selectedTab === SelectedTab.ANCHOR && <AnchorWalletView snackbarContent={redirectReason}/>}
          {selectedTab === SelectedTab.MY_EVENTS && <MyEventsView />}
        </div>
      </div>
    </CssBox>
  );
}

export default SettingsView;