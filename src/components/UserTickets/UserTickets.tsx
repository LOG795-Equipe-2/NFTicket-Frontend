import {
  Box,
  ButtonGroup,
  styled,
  Button,
  Collapse,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import TicketVisualiser from "../TicketVisualiser/TicketVisualiser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import {
  exportComponentAsPDF,
  exportComponentAsPNG,
} from "react-component-export-image";
import "./UserTickets.scss";
import EventCard from "../EventCard/EventCard";
import React, { useEffect, useState, useContext, useRef } from "react";
import NFTicketTransactionServiceInstance, {
  NFTicketTransactionService,
} from "../../services/NFTicketTransactionService";
import { useSearchParams } from "react-router-dom";
import { AppwriteContext } from "../../App";
import { AssignmentInd } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";

let serviceNFT: NFTicketTransactionService;

async function connectToBackend() {
  let service = NFTicketTransactionServiceInstance;
  return service;
}

const CssBox = styled(Box)(({ theme }) => ({
  ".UserTickets": {},
}));

export default function UserTickets() {
  const [isFetching, setIsFetching] = useState(true);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [username, setUsername] = useState("");
  const toggleEventDetails = () => {
    setShowEventDetails(!showEventDetails);
  };
  const triggerSignTicket = async (ticketId: string) => {
    if (!!ticketId) {
      setIsFetching(true);
      try {
        let transactionObject = await serviceNFT.signTicket(username, ticketId);
        let validationResponse = await serviceNFT.validateSignTicket(
          transactionObject
        );
        if (validationResponse.success) {
          // Update UI to complete signing of ticket.
          let copyTickets = [...tickets];
          let updatedTicket = copyTickets.find(
            (ticket) => (ticket as any).assetId == ticketId
          );
          if (!!updatedTicket) {
            (updatedTicket as any).signed = 1;
            setTickets(copyTickets);
          }
          setIsFetching(false);
          setSnackbarContent({
            type: "success",
            message:
              "Votre billet a été signé avec succès! Il peut désormais être utilisé pour accéder à l'événement.",
          });
        } else {
          setIsFetching(false);
          setSnackbarContent({
            type: "error",
            message:
              "Une erreur s'est produite dans la transaction, veuillez réessayer plus tard.",
          });
        }
      } catch (e: any) {
        setIsFetching(false);
        setSnackbarContent({
          type: "error",
          message:
            "Une erreur s'est produite dans la transaction, veuillez réessayer plus tard.",
        });
      }
    }
  };
  const context = useContext(AppwriteContext);

  let componentRef = useRef();

  useEffect(() => {
    const success = searchParams.get("success");
    connectToBackend().then((service) => {
      serviceNFT = service;

      const accountName = service.getManager().getAccountName()?.toString();
      if (accountName && service.getManager().isUserLogged()) {
        setUsername(accountName);
        service.getAssetsForUser(accountName).then((tickets) => {
          setTickets(tickets);
          setIsFetching(false);
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
      <Backdrop open={isFetching} sx={{ zIndex: 99 }}>
        <CircularProgress size={50} />
      </Backdrop>
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
          <div
            className="UserTickets__ticketsCarousel"
            ref={componentRef as any}
          >
            <Carousel
              interval={20000}
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
                    eventName={ticket.event.name}
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
              {(tickets[selectedTicket] as any).signed !== 1 ? (
                <Button
                  onClick={() =>
                    triggerSignTicket((tickets[selectedTicket] as any).assetId)
                  }
                >
                  Signer le billet <AssignmentInd />
                </Button>
              ) : (
                <Button color="success" disabled>
                  Signé <CheckIcon sx={{ marginLeft: "5px" }} />
                </Button>
              )}
              <Button
                onClick={() =>
                  exportComponentAsPNG(componentRef as any, {
                    fileName:
                      (tickets[selectedTicket] as any).event.name +
                      "_" +
                      (tickets[selectedTicket] as any).assetId,
                  })
                }
              >
                Enregistrer le billet <BookOnlineOutlinedIcon />
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
