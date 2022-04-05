import { Alert, Button, Snackbar, styled, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Link, useParams } from "react-router-dom"
import Event from "../../interfaces/Event";
import TicketVisualiser from "../TicketVisualiser/TicketVisualiser";
import NFTicketTransactionServiceInstance, { NFTicketTransactionService } from '../../services/NFTicketTransactionService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './BuyTicketView.scss';
import { useEffect } from "react";
import React from "react";

let serviceNFT: NFTicketTransactionService

async function connectToBackend() {
  let service = NFTicketTransactionServiceInstance;
  await service.init()
  return service
}

export default function BuyTicketView() {
  const [snackbarContent, setSnackbarContent] = React.useState<any>(null);
  const { id, ticketId } = useParams();
  const CssBox = styled(Box)(({ theme }) => ({
    ".BuyTicket": {
      "&__content": {
        ".cost": {
          ".header": {
            color: theme.palette.primary.dark
          },
          ".text": {
            color: theme.palette.info.main
          }
        }
      }
    }
  }));
  const event: Event = {
    id: id || "1",
    name: "A test event",
    description: "This event is a test event for NFTicket",
    locationAddress: "1100 Notre-Dame St W, Montreal, Quebec H3C 1K3",
    locationName: "École de technologie supérieure",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2912&q=80",
    dateTime: new Date(),
    ticketCategories: [
      {
        id: "6245ce6ecc4fed483329",
        type: "Standard",
        price: 20.00,
        initialAmount: 100,
        remainingAmount: 10,
        styling: {
          useBorder: false,
          primaryColor: "#FFFFFF",
          secondaryColor: "#FFFFFF",
          backgroundColor: "#141414",
          backgroundImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
        }
      },
      {
        id: "6243166810eaee472ab6",
        type: "VIP",
        price: 30.00,
        initialAmount: 20,
        remainingAmount: 2,
        styling: {
          useBorder: true,
          primaryColor: "#FFFFFF",
          secondaryColor: "#bb8d48",
          backgroundColor: "#141414",
          backgroundImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
        }
      }
    ]
  };
  useEffect(() => {
    connectToBackend().then((service) => {
      // Try to restore the session at beginning.
      // service.getManager().restoreSession().then((value) => {
      //   console.log("restored session?: " + value)
      // })
      serviceNFT = service
    });
  }, []); // checks for changes in the values in this array
  const ticket = event.ticketCategories.find(ticketCategory => ticketCategory.id === ticketId);
  const processTicketTransaction = async () => {
    // TODO: Call Anchor API, update remaining QTY on success
    if (!!ticketId) {
      try {
        let transactionObject = await serviceNFT.buyTicketFromCategory(ticketId);
        let validationResponse = await serviceNFT.validateBuyTicketFromCategory(transactionObject);
        console.log(validationResponse)
      } catch (e: any) {
        console.log(e);
        setSnackbarContent({ type: "error", message: "Une erreur s'est produite dans la transaction, veuillez réessayer plus tard." })
      }

    }

  }
  return (
    ticket ?
      <CssBox className="BuyTicket">
        <Snackbar open={!!snackbarContent} autoHideDuration={6000} onClose={() => setSnackbarContent(null)}>
          {snackbarContent && (
            <Alert onClose={() => setSnackbarContent(null)} severity={snackbarContent.type}>{snackbarContent.message}</Alert>
          )}
        </Snackbar>
        <div className="BuyTicket__content">
          <div className="go-back">
            <Button variant="outlined" color="primary"><Link to={"/events/" + id}><ArrowBackIcon /> Retourner à l'événement</Link></Button>
          </div>
          <TicketVisualiser ticket={ticket} event={event} size="large" />
          <div className="cost">
            <Typography className="header" variant="h3">Coût de la transaction</Typography>
            <Typography className="text" variant="h4">{ticket.price.toFixed(2)} $</Typography>
          </div>
          <div className="confirm">
            <Button onClick={processTicketTransaction} variant="contained" color="info">Confirmer la transaction</Button>
          </div>
        </div>
      </CssBox> :
      <div />
  )
}