import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Link, Navigate, useParams } from "react-router-dom";
import { Event } from "../../interfaces/Event";
import TicketVisualiser from "../TicketVisualiser/TicketVisualiser";
import NFTicketTransactionServiceInstance, {
  NFTicketTransactionService,
} from "../../services/NFTicketTransactionService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./BuyTicketView.scss";
import { useEffect } from "react";
import React from "react";
import EventService from "../../services/EventService";
import TicketCategory from "../../interfaces/TicketCategory";
import { AppwriteContext } from "../../App";

let serviceNFT: NFTicketTransactionService;

async function connectToBackend() {
  let service = NFTicketTransactionServiceInstance;
  return service;
}

enum PageState {
  AWAITING_CONFIRMATION,
  FETCHING,
  REDIRECT_SUCCESS,
}

export default function BuyTicketView() {
  const [snackbarContent, setSnackbarContent] = React.useState<any>(null);
  const { id, ticketCategoryId } = useParams();
  const [pageStatus, setPageStatus] = React.useState<PageState>(
    PageState.AWAITING_CONFIRMATION
  );
  const [ticket, setTicket] = React.useState<TicketCategory | undefined>(undefined);
  const [event, setEvent] = React.useState<Event | undefined>(undefined);

  const CssBox = styled(Box)(({ theme }) => ({
    ".BuyTicket": {
      "&__content": {
        ".cost": {
          ".header": {
            color: theme.palette.primary.dark,
          },
          ".text": {
            color: theme.palette.info.main,
          },
        },
      },
    },
  }));
  
  useEffect(() => {
    if(id) {
      EventService.getSingleEvent(id).then(e => {
        setTicket(e.ticketCategories.find(ticketCategory => ticketCategory.$id === ticketCategoryId))
        setEvent(e);
      })
    }

    connectToBackend().then((service) => {
      // Try to restore the session at beginning.
      // service.getManager().restoreSession().then((value) => {
      //   console.log("restored session?: " + value)
      // })
      serviceNFT = service;
    });
  }, []); // checks for changes in the values in this array

  const processTicketTransaction = async () => {
    // TODO: Call Anchor API, update remaining QTY on success
    if (!!ticketCategoryId) {
      setPageStatus(PageState.FETCHING);
      try {
        let transactionObject = await serviceNFT.buyTicketFromCategory(
          ticketCategoryId
        );
        let validationResponse = await serviceNFT.validateBuyTicketFromCategory(
          transactionObject
        );
        if (validationResponse.success) {
          setPageStatus(PageState.REDIRECT_SUCCESS);
        } else {
          setSnackbarContent({
            type: "error",
            message:
              "Une erreur s'est produite dans la transaction, veuillez réessayer plus tard.",
          });
          setPageStatus(PageState.AWAITING_CONFIRMATION);
        }

      } catch (e: any) {
        setSnackbarContent({
          type: "error",
          message:
            "Une erreur s'est produite dans la transaction, veuillez réessayer plus tard.",
        });
        setPageStatus(PageState.AWAITING_CONFIRMATION);
      }
    }
  };
  return ticket && event ? (
    <CssBox className="BuyTicket">
      {pageStatus === PageState.REDIRECT_SUCCESS && (
        <Navigate to={`/tickets?success=${ticketCategoryId}`} />
      )}
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
      <div className="BuyTicket__content">
        <div className="go-back">
          <Button variant="outlined" color="primary">
            <Link to={"/events/" + id}>
              <ArrowBackIcon /> Retourner à l'événement
            </Link>
          </Button>
        </div>
        <TicketVisualiser ticket={ticket} eventName={event.name} size="large" />
        <div className="cost">
          <Typography className="header" variant="h3">
            Coût de la transaction
          </Typography>
          <Typography className="text" variant="h4">
            {ticket.price.toFixed(2)} EOS
          </Typography>
        </div>
        <div className="confirm">
          <Button
            onClick={processTicketTransaction}
            variant="contained"
            color="info"
            disabled={pageStatus !== PageState.AWAITING_CONFIRMATION}
          >
            {pageStatus === PageState.FETCHING ? (
              <CircularProgress color="info" size={20} />
            ) : (
              "Confirmer la transaction"
            )}
          </Button>
        </div>
      </div>
    </CssBox>
  ) : (
    <div />
  );
}
