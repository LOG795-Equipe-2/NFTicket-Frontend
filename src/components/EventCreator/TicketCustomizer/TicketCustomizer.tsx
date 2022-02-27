import React from "react";
import {
  List,
  ListItemText,
  ListItemButton,
  Card,
  Divider,
} from "@mui/material";
import Ticket from "../../../interfaces/Ticket";
import TicketVisualiser from "./TicketVisualiser/TicketVisualiser";

type TicketCustomizerProps = {
  tickets: Ticket[];
};

type TicketCustomizerState = {
  currentTicketSelected: number;
};

class TicketCustomizer extends React.Component<
  TicketCustomizerProps,
  TicketCustomizerState
> {
  constructor(props: TicketCustomizerProps) {
    super(props);
    this.state = {
      currentTicketSelected: 0,
    };
  }
  render() {
    return (
      <div className="EventCreator__customizeTickets" key="section-1">
        <div className="EventCreator__customizeTickets__menu">
          <Card>
            <List>
              {this.props.tickets.map((ticket, index) => (
                <React.Fragment key={"ticket-menu-item-" + index}>
                  {index !== 0 && <Divider />}
                  <ListItemButton
                    onClick={() =>
                      this.setState({ currentTicketSelected: index })
                    }
                    selected={index === this.state.currentTicketSelected}
                  >
                    <ListItemText primary={ticket.type}></ListItemText>
                  </ListItemButton>
                </React.Fragment>
              ))}
            </List>
          </Card>
        </div>
        <div className="EventCreator__customizeTickets__canvas">
          <TicketVisualiser />
        </div>
      </div>
    );
  }
}

export default TicketCustomizer;
