import { Box, Typography, styled, Link, Button } from "@mui/material";
import React from "react";
import { newEventData, Event } from "../../../interfaces/Event";
import EventCard from "../../EventCard/EventCard";
import TicketVisualiser from "../../TicketVisualiser/TicketVisualiser";
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";

type EventConfirmationProps = {
  event: newEventData;
  createEvent: Function;
};

type EventConfirmationState = {};

const CssBox = styled(Box)(({ theme }) => ({
  ".header": {
    color: theme.palette.primary.main,
  },
  ".description-header": {
    color: theme.palette.primary.dark,
  },
}));

function formatNewEventDataToEventView(event: newEventData): Event {
  return {
    $id: event.$id,
    description: event.description,
    eventTime: event.dateTime,
    imageUrl: event.image as string,
    locationAddress: event.locationAddress,
    locationCity: event.locationCity || "",
    locationName: event.locationName,
    name: event.name,
    ticketCategories: event.ticketCategories
  }
}

class EventConfirmation extends React.Component<
  EventConfirmationProps,
  EventConfirmationState
> {
  render() {
    return (
      <CssBox className="EventConfirmation">
        <div className="EventConfirmation__event">
          <Typography className="header" variant="subtitle1">
            Événement
          </Typography>
          <Box sx={{ width: 350 }}><EventCard showLink={false} event={formatNewEventDataToEventView(this.props.event)} /></Box>
        </div>
        <div className="EventConfirmation__tickets">
          <Typography className="header" variant="subtitle1">
            Billets
          </Typography>

          {this.props.event.ticketCategories.map((ticketCategory) => (
            <div key={"confirm-" + ticketCategory.name} className="ticket">
              <TicketVisualiser
                eventName={this.props.event.name}
                ticket={ticketCategory}
                size="small"
              />
              <div className="ticket__description">
                <div className="ticket__description__item">
                  <Typography className="description-header" variant="h5">
                    Prix
                  </Typography>
                  <Typography variant="body1">
                    {ticketCategory.price.toFixed(2)} EOS
                  </Typography>
                </div>
                <div className="ticket__description__item">
                  <Typography className="description-header" variant="h5">
                    Quantité
                  </Typography>
                  <Typography variant="body1">{ticketCategory.initialQuantity}</Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="EventConfirmation__confirm">
          <Button
            onClick={() => this.props.createEvent()}
            color="info"
            variant="contained"
            id="confirm-styling"
          >
            Créer l'événement <ConfirmationNumber />
          </Button>
        </div>
      </CssBox>
    );
  }
}

export default EventConfirmation;
