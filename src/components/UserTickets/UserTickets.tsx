import {
  Box,
  ButtonGroup,
  styled,
  Button,
  Collapse,
  Snackbar,
  Alert,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Event from "../../interfaces/Event";
import TicketVisualiser from "../TicketVisualiser/TicketVisualiser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import "./UserTickets.scss";
import EventCard from "../EventCard/EventCard";
import React, { useEffect, useState, useContext } from "react";
import NFTicketTransactionServiceInstance, {
  NFTicketTransactionService,
} from "../../services/NFTicketTransactionService";
import { useSearchParams } from "react-router-dom";
import { AppwriteContext } from "../../App";

async function connectToBackend() {
  let service = NFTicketTransactionServiceInstance;
  await service.init();
  return service;
}

const CssBox = styled(Box)(({ theme }) => ({
  ".UserTickets": {},
}));

export default function UserTickets() {
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [username, setUsername] = useState("");
  const toggleEventDetails = () => {
    setShowEventDetails(!showEventDetails);
  };
  const context = useContext(AppwriteContext);

  useEffect(() => {
    const success = searchParams.get("success");
    connectToBackend().then((service) => {
      const accountName = service.getManager().getAccountName()?.toString();
      if (accountName && service.getManager().isUserLogged()) {
        setUsername(accountName);
        service.getAssetsForUser(accountName).then((tickets) => {
          setTickets(tickets);
        });
      }
    });
    if (!!success) {
      setSnackbarContent({
        type: "success",
        message:
          "Votre billet a été acheté avec succès! Vous pouvez le retrouver sur cette page.",
      });
    }
  }, []);
  return (
    <CssBox className="UserTickets">
      {tickets.length > 0 && (
        <React.Fragment>
          <Snackbar
            open={!!snackbarContent}
            autoHideDuration={6000}
            onClose={() => setSnackbarContent(null)}
          >
            {snackbarContent && (
              <Alert
                onClose={() => setSnackbarContent(null)}
                severity={snackbarContent.type}
              >
                {snackbarContent.message}
              </Alert>
            )}
          </Snackbar>
          <div className="UserTickets__ticketsCarousel">
            <Carousel
              interval={10000}
              navButtonsAlwaysVisible
              animation="slide"
              onChange={(e: number | undefined) => setSelectedTicket(e || 0)}
            >
              {tickets.map((ticket: any, index) => (
                <Box
                  key={"my_ticket_" + index}
                  className="UserTickets__ticketsCarousel__visualiserContainer"
                >
                  <TicketVisualiser
                    size="large"
                    event={ticket.event}
                    ticket={ticket.category}
                    assetId={ticket.assetId}
                    username={username}
                  />
                </Box>
              ))}
            </Carousel>
          </div>
          <div className="UserTickets__actions">
            <ButtonGroup>
              <Button>
                Utiliser le billet <BookOnlineOutlinedIcon />
              </Button>
              <Button onClick={toggleEventDetails}>
                Voir l'événement <ExpandMoreIcon />
              </Button>
            </ButtonGroup>
          </div>
          <div className="UserTickets__eventDetails">
            <Collapse sx={{ width: 400 }} in={showEventDetails}>
              {tickets[selectedTicket] && (
                <EventCard
                  event={(tickets[selectedTicket] as any).event}
                  showLink={false}
                />
              )}
            </Collapse>
          </div>
        </React.Fragment>
      )}
    </CssBox>
  );
}
