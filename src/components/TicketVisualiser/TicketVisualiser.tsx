import React from "react";
import Ticket from "../../interfaces/TicketCategory";
import { Card, Typography } from "@mui/material";
import "./TicketVisualiser.scss";
import { Event } from "../../interfaces/Event";
import QRCode from "react-qr-code";

type TicketVisualiserProps = {
  ticket: Ticket;
  eventName: string;
  size: string;
  assetId?: string;
  username?: string;
};

type TicketVisualiserState = {};
class TicketVisualiser extends React.Component<
  TicketVisualiserProps,
  TicketVisualiserState
> {
  render() {
    const sizes = {
      large: {
        width: "1000px",
        height: "400px",
        qrSize: 180,
        eventNameFont: "3rem",
        ticketTypeFont: "1.5rem",
        padding: "16px",
        qrPadding: "8px",
        borderSize: "4px",
      },
      small: {
        width: "300px",
        height: "120px",
        qrSize: 60,
        eventNameFont: "1rem",
        ticketTypeFont: "0.7rem",
        padding: "5px",
        qrPadding: "3px",
        borderSize: "2px",
      },
      normal: {
        width: "500px",
        height: "200px",
        qrSize: 90,
        eventNameFont: "1.5rem",
        ticketTypeFont: "0.75rem",
        padding: "8px",
        qrPadding: "4px",
        borderSize: "3px",
      },
    };
    return this.props.ticket && this.props.eventName ? (
      <Card
        raised
        className="TicketVisualiser"
        sx={{
          background: `linear-gradient(to left, rgba(0,0,0,0) 0%, ${this.props.ticket.styling.backgroundColor} 60%, ${this.props.ticket.styling.backgroundColor} 100%),url('${this.props.ticket.styling.backgroundImage}') no-repeat`,
          borderWidth: this.props.ticket.styling.useBorder
            ? (sizes as any)[this.props.size].borderSize
            : "0",
          borderColor: this.props.ticket.styling.secondaryColor,
          width: this.props.ticket.styling.useBorder
            ? `calc(${(sizes as any)[this.props.size].width} - calc(2 * ${
                (sizes as any)[this.props.size].borderSize
              }))`
            : `${(sizes as any)[this.props.size].width}`,
          height: this.props.ticket.styling.useBorder
            ? `calc(${(sizes as any)[this.props.size].height} - calc(2 * ${
                (sizes as any)[this.props.size].borderSize
              }))`
            : `${(sizes as any)[this.props.size].height}`,
        }}
      >
        <div
          style={{
            top: (sizes as any)[this.props.size].padding,
            right: (sizes as any)[this.props.size].padding,
            color: this.props.ticket.styling.secondaryColor,
          }}
          className="TicketVisualiser__assetID"
        >
          <Typography variant="h5">{this.props.assetId}</Typography>
        </div>
        <div
          className="TicketVisualiser__content"
          style={{
            height: `calc(100% - 2 * ${
              (sizes as any)[this.props.size].padding
            })`,
            padding: (sizes as any)[this.props.size].padding,
          }}
        >
          <div className="TicketVisualiser__content__header">
            <div
              className="event-name"
              style={{ color: this.props.ticket.styling.primaryColor }}
            >
              <Typography
                sx={{ fontSize: (sizes as any)[this.props.size].eventNameFont }}
                variant="h3"
              >
                {this.props.eventName}
              </Typography>
            </div>
            <div
              className="ticket-type"
              style={{ color: this.props.ticket.styling.secondaryColor }}
            >
              <Typography
                sx={{
                  fontSize: (sizes as any)[this.props.size].ticketTypeFont,
                }}
                variant="h5"
              >
                {this.props.ticket.name}
              </Typography>
            </div>
            {this.props.assetId && this.props.username && (
              <div
                className="ticket-code"
                style={{
                  marginLeft: (sizes as any)[this.props.size].qrPadding,
                }}
              >
                <QRCode
                  size={(sizes as any)[this.props.size].qrSize}
                  fgColor="#000"
                  bgColor={this.props.ticket.styling.primaryColor}
                  value={JSON.stringify({
                    username: this.props.username,
                    assetId: this.props.assetId
                  })}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    ) : (
      <div></div>
    );
  }
}

export default TicketVisualiser;
