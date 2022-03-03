import React from "react";
import Ticket from "../../interfaces/Ticket";
import { Card, Typography } from "@mui/material";
import "./TicketVisualiser.scss";
import Event from "../../interfaces/Event";

type TicketVisualiserProps = {
  ticket: Ticket;
  event: Event;
  size: string
};

type TicketVisualiserState = {};
class TicketVisualiser extends React.Component<
  TicketVisualiserProps,
  TicketVisualiserState
> {
  render() {
    const sizes = {
      "large": {
        width: '1000px',
        height: '400px',
        qrSize: '180px',
        eventNameFont: '3rem',
        ticketTypeFont: '1.5rem',
        padding: '16px',
        borderSize: '4px'
      },
      "small": {
        width: '300px',
        height: '120px',
        qrSize: '60px',
        eventNameFont: '1rem',
        ticketTypeFont: '0.7rem',
        padding: '5px',
        borderSize: '2px'
      }
    }
    return this.props.ticket && this.props.event ? (
      <Card
      raised
        className="TicketVisualiser"
        sx={{
          background: `linear-gradient(to left, rgba(0,0,0,0) 0%, ${this.props.ticket.styling.backgroundColor} 60%, ${this.props.ticket.styling.backgroundColor} 100%),url('${
            this.props.ticket.styling.backgroundImage
          }') no-repeat`,
          borderWidth: this.props.ticket.styling.useBorder ? (sizes as any)[this.props.size].borderSize : '0',
          borderColor: this.props.ticket.styling.secondaryColor,
          width: this.props.ticket.styling.useBorder ? `calc(${(sizes as any)[this.props.size].width} - calc(2 * ${(sizes as any)[this.props.size].borderSize}))` : `${(sizes as any)[this.props.size].width}`,
          height: this.props.ticket.styling.useBorder ? `calc(${(sizes as any)[this.props.size].height} - calc(2 * ${(sizes as any)[this.props.size].borderSize}))` : `${(sizes as any)[this.props.size].height}`
        }}
      >
        <div className="TicketVisualiser__content" style={{ height: `calc(100% - 2 * ${(sizes as any)[this.props.size].padding})`, padding: (sizes as any)[this.props.size].padding }}>
          <div className="TicketVisualiser__content__header">
            <div className="event-name" style={{ color: this.props.ticket.styling.primaryColor }}>
              <Typography sx={{ fontSize: (sizes as any)[this.props.size].eventNameFont }} variant="h3">{this.props.event.name}</Typography>
            </div>
            <div className="ticket-type" style={{ color: this.props.ticket.styling.secondaryColor }}>
              <Typography sx={{ fontSize: (sizes as any)[this.props.size].ticketTypeFont }} variant="h5">{this.props.ticket.type}</Typography>
            </div>
            <div
              className="ticket-code"
              style={{
                backgroundColor: this.props.ticket.styling.primaryColor,
                width: (sizes as any)[this.props.size].qrSize,
                height: (sizes as any)[this.props.size].qrSize,
                marginLeft: "-" + (sizes as any)[this.props.size].padding
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
