import React from "react";
import Ticket from "../../interfaces/Ticket";
import { Card, Typography } from "@mui/material";
import "./TicketVisualiser.scss";
import Event from "../../interfaces/Event";

type TicketVisualiserProps = {
  ticket: Ticket;
  event: Event;
};

type TicketVisualiserState = {};

class TicketVisualiser extends React.Component<
  TicketVisualiserProps,
  TicketVisualiserState
> {
  render() {
    return this.props.ticket && this.props.event ? (
      <Card
      raised
        className="TicketVisualiser"
        sx={{
          background: `linear-gradient(to left, rgba(0,0,0,0) 0%, ${this.props.ticket.styling.backgroundColor} 60%, ${this.props.ticket.styling.backgroundColor} 100%),url('${
            this.props.ticket.styling.backgroundImage
          }') no-repeat`,
          borderWidth: this.props.ticket.styling.useBorder ? '4px' : '0',
          borderColor: this.props.ticket.styling.secondaryColor,
          width: this.props.ticket.styling.useBorder ? '992px' : '1000px',
          height: this.props.ticket.styling.useBorder ? '392px' : '400px'
        }}
      >
        <div className="TicketVisualiser__content">
          <div className="TicketVisualiser__content__header">
            <div className="event-name" style={{ color: this.props.ticket.styling.primaryColor }}>
              <Typography variant="h3">{this.props.event.name}</Typography>
            </div>
            <div className="ticket-type" style={{ color: this.props.ticket.styling.secondaryColor }}>
              <Typography variant="h5">{this.props.ticket.type}</Typography>
            </div>
            <div
              className="ticket-code"
              style={{
                backgroundColor: this.props.ticket.styling.primaryColor
              }}
            ></div>
          </div>
        </div>
      </Card>
    ) : (
      <div></div>
    );
  }
}

export default TicketVisualiser;
