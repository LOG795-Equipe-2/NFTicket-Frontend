import { Box, ButtonGroup, styled, Button, Collapse, Snackbar, Alert } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Event from "../../interfaces/Event";
import TicketVisualiser from "../TicketVisualiser/TicketVisualiser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import "./UserTickets.scss";
import EventCard from "../EventCard/EventCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CssBox = styled(Box)(({ theme }) => ({
  ".UserTickets": {},
}));

export default function UserTickets() {
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const toggleEventDetails = () => {
    setShowEventDetails(!showEventDetails);
  };
  const event: Event = {
    id: "1",
    name: "A test event",
    description: "This event is a test event for NFTicket",
    locationAddress: "1100 Notre-Dame St W, Montreal, Quebec H3C 1K3",
    locationName: "École de technologie supérieure",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2912&q=80",
    dateTime: new Date(),
    ticketCategories: [
      {
        id: "1",
        type: "Standard",
        price: 20.0,
        initialAmount: 100,
        remainingAmount: 10,
        styling: {
          useBorder: false,
          primaryColor: "#FFFFFF",
          secondaryColor: "#FFFFFF",
          backgroundColor: "#141414",
          backgroundImage:
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        },
      },
      {
        id: "2",
        type: "VIP",
        price: 30.0,
        initialAmount: 20,
        remainingAmount: 2,
        styling: {
          useBorder: true,
          primaryColor: "#FFFFFF",
          secondaryColor: "#bb8d48",
          backgroundColor: "#141414",
          backgroundImage:
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        },
      },
    ],
  };

  useEffect(() => {
    const success = searchParams.get("success");
    if (!!success) {
      setSnackbarContent({ type: 'success', message: "Votre billet a été acheté avec succès! Vous pouvez le retrouver sur cette page." });
    }
  }, []);
  return (
    <CssBox className="UserTickets">
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
        <Carousel interval={10000} navButtonsAlwaysVisible animation="slide">
          {event.ticketCategories.map((ticket, index) => (
            <Box
              key={"my_ticket_" + index}
              className="UserTickets__ticketsCarousel__visualiserContainer"
            >
              <TicketVisualiser size="large" event={event} ticket={ticket} />
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
          <EventCard event={event} showLink={false} />
        </Collapse>
      </div>
    </CssBox>
  );
}
