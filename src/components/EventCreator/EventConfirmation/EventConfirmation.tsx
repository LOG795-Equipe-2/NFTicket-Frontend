import { Box, Typography, styled, Link, Button } from "@mui/material";
import React from "react";
import Event from "../../../interfaces/Event";
import EventCard from "../../EventCard/EventCard";
import TicketVisualiser from "../../TicketVisualiser/TicketVisualiser";
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";

type EventConfirmationProps = {
  event: Event;
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
          <EventCard showLink={false} event={this.props.event} />
        </div>
        <div className="EventConfirmation__tickets">
          <Typography className="header" variant="subtitle1">
            Billets
          </Typography>

          {this.props.event.tickets.map((ticket) => (
            <div className="ticket">
              <TicketVisualiser
                event={this.props.event}
                ticket={ticket}
                size="small"
              />
              <div className="ticket__description">
                <div className="ticket__description__item">
                  <Typography className="description-header" variant="h5">
                    Prix
                  </Typography>
                  <Typography variant="body1">
                    {ticket.price.toFixed(2)}$
                  </Typography>
                </div>
                <div className="ticket__description__item">
                  <Typography className="description-header" variant="h5">
                    Quantité
                  </Typography>
                  <Typography variant="body1">{ticket.amount}</Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="EventConfirmation__confirm">
          <Button
            onClick={() => this.props.createEvent()}
            color="success"
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
