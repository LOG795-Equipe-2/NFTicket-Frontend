import { Box, Button, styled, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { Event as EventViewModel } from '../../interfaces/Event';
import EventCard from '../EventCard/EventCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FestivalIcon from '@mui/icons-material/Festival';
import './EventView.scss';
import TicketVisualiser from '../TicketVisualiser/TicketVisualiser';
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from 'react';
import EventService from '../../services/EventService';

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

  const [event, setEvent] = React.useState<EventViewModel | undefined>(undefined);

  React.useEffect(() => {
    if(id) {
      EventService.getSingleEvent(id).then(e => {
        setEvent(e);
      })
    }
  }, [])
  
  return (
    event ? (
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
              <AccessTimeIcon /> <Typography>{event.eventTime.toLocaleString()}</Typography>
            </div>
          </div>
        </div>
        <div className="EventView__tickets">
          <Typography className="header" variant="h3">Billets</Typography>
          {event.ticketCategories.map((ticketCategory) => (
            <div className="EventView__tickets__ticket" key={"ticketCategory-" + ticketCategory.name}>
              {ticketCategory.remainingQuantity && ticketCategory.remainingQuantity > 0 && (
                <React.Fragment>
                  <TicketVisualiser eventName={event.name} ticket={ticketCategory} size="small" />
                  <div className="rightSide">
                    <div className="description">
                      <div className="description__item">
                        <Typography variant="h5">Type </Typography>{ticketCategory.name}
                      </div>
                      <div className="description__item">
                        <Typography variant="h5">Prix </Typography>{ticketCategory.price.toFixed(2)} $
                      </div>
                    </div>

                    {ticketCategory.$id && (
                      <Link to={"buy/" + ticketCategory.$id}>
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
    ) : (<div>a</div>)
  )
}
export default EventView;