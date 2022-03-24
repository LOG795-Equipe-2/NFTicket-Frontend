import { Button, styled, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Link, useParams } from "react-router-dom"
import Event from "../../interfaces/Event";
import TicketVisualiser from "../TicketVisualiser/TicketVisualiser";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './BuyTicketView.scss';

export default function BuyTicketView() {
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
        id: "1",
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
        id: "2",
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
  const ticket = event.ticketCategories.find(ticketCategory => ticketCategory.id === ticketId);
  const processTicketTransaction = () => {
    // TODO: Call Anchor API, update remaining QTY on success
  }
  return (
    ticket ?
      <CssBox className="BuyTicket">
        <div className="BuyTicket__content">
          <div className="go-back">
            <Button variant="outlined" color="primary"><Link to={"/events/" + id}><ArrowBackIcon/> Retourner à l'événement</Link></Button>
          </div>
          <TicketVisualiser ticket={ticket} event={event} size="large" />
          <div className="cost">
            <Typography className="header" variant="h3">Coût de la transaction</Typography>
            <Typography className="text" variant="h4">{ticket.price.toFixed(2)} $</Typography>
          </div>
          <div className="confirm">
            <Button onClick={processTicketTransaction} variant="contained" color="success">Confirmer la transaction</Button>
          </div>
        </div>
      </CssBox> :
      <div />
  )
}