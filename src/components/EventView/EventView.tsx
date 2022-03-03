import { Box, Button, styled, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import Event from '../../interfaces/Event';
import EventCard from '../EventCard/EventCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FestivalIcon from '@mui/icons-material/Festival';
import './EventView.scss';
import TicketVisualiser from '../TicketVisualiser/TicketVisualiser';
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from 'react';

const CssBox = styled(Box)(({ theme }) => ({
  ".EventView": {
    "&__description": {
      ".location": {
        "svg": {
          color: theme.palette.primary.main
        },
        ".MuiTypography-root": {
          color: theme.palette.primary.dark
        }
      }
    },
    "&__tickets": {
      ".header": {
        color: theme.palette.primary.dark
      },
      "&__ticket": {
        ".description": {
          "&__item": {
            ".MuiTypography-root": {
              color: theme.palette.primary.main
            }
          }
        }
      }
    }
  }

}))

function EventView() {
  const { id } = useParams();
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
  }
  return (
    <CssBox className="EventView">
      <div className="EventView__description">
        <EventCard event={event} showLink={false} />
        <div className="location">
          <div className="location__detail">
            <LocationOnIcon /> <Typography>{event.locationAddress}</Typography>
          </div>
          <div className="location__detail">
            <FestivalIcon /> <Typography>{event.locationName}</Typography>
          </div>
          <div className="location__detail">
            <AccessTimeIcon /> <Typography>{event.dateTime.toLocaleString()}</Typography>
          </div>
        </div>
      </div>
      <div className="EventView__tickets">
        <Typography className="header" variant="h3">Billets</Typography>
        {event.ticketCategories.map((ticketCategory) => (
          <div className="EventView__tickets__ticket" key={"ticketCategory-" + ticketCategory.type}>
            {ticketCategory.remainingAmount && ticketCategory.remainingAmount > 0 && (
              <React.Fragment>
                <TicketVisualiser event={event} ticket={ticketCategory} size="small" />
                <div className="rightSide">
                  <div className="description">
                    <div className="description__item">
                      <Typography variant="h5">Type </Typography>{ticketCategory.type}
                    </div>
                    <div className="description__item">
                      <Typography variant="h5">Prix </Typography>{ticketCategory.price.toFixed(2)} $
                    </div>
                  </div>

                  {ticketCategory.id && (
                    <Link to={"buy/" + ticketCategory.id}>
                      <Button className="buy-ticket" variant="outlined" color="primary">Acheter un billet <ConfirmationNumber /></Button>
                    </Link>
                  )}
                </div>
              </React.Fragment>
            )}
          </div>
        ))}
      </div>
    </CssBox>
  )
}
export default EventView;