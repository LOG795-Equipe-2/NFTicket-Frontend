import React from "react";
import {
  List,
  ListItemText,
  ListItemButton,
  Card,
  Divider,
  TextField,
  Typography,
  Switch,
  Button,
} from "@mui/material";
import TicketVisualiser from "../../TicketVisualiser/TicketVisualiser";
import Event from "../../../interfaces/Event";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type TicketCustomizerProps = {
  event: Event;
  updateTicketStyling: Function;
  confirmTicketStyling: Function;
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

  updateTicketStyling(key: string, value: any) {
    const ticketStyling =
      this.props.event.tickets[this.state.currentTicketSelected].styling;
    switch (key) {
      case "backgroundImage":
        if (value && value.length) {
          let fr = new FileReader();
          fr.onload = () => {
            if (!!fr.result) {
              ticketStyling[key] = fr.result as string;
              this.props.updateTicketStyling(
                this.state.currentTicketSelected,
                ticketStyling
              );
            }
          };
          fr.readAsDataURL(value[0]);
        }
        break;
      default:
        (ticketStyling as any)[key] = value;
        break;
    }
    this.props.updateTicketStyling(
      this.state.currentTicketSelected,
      ticketStyling
    );
  }

  render() {
    return this.props.event &&
      this.props.event.tickets &&
      this.props.event.tickets.length > 0 ? (
      <div className="EventCreator__customizeTickets" key="section-1">
        <div className="EventCreator__customizeTickets__menu">
          <Card>
            <List>
              {this.props.event.tickets.map((ticket, index) => (
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
        <div className="EventCreator__customizeTickets__editor">
          <TicketVisualiser
            size="large"
            event={this.props.event}
            ticket={this.props.event.tickets[this.state.currentTicketSelected]}
          />
          <div className="EventCreator__customizeTickets__editor__fields">
            <Typography variant="subtitle1">Couleurs</Typography>
            <div className="row">
              <TextField
                onChange={(e) =>
                  this.updateTicketStyling("primaryColor", e.target.value)
                }
                value={
                  this.props.event.tickets[this.state.currentTicketSelected]
                    .styling.primaryColor
                }
                type="color"
                label="Couleur principale"
              />
              <TextField
                onChange={(e) =>
                  this.updateTicketStyling("secondaryColor", e.target.value)
                }
                value={
                  this.props.event.tickets[this.state.currentTicketSelected]
                    .styling.secondaryColor
                }
                type="color"
                label="Couleur secondaire"
              />
              <TextField
                onChange={(e) =>
                  this.updateTicketStyling("backgroundColor", e.target.value)
                }
                value={
                  this.props.event.tickets[this.state.currentTicketSelected]
                    .styling.backgroundColor
                }
                type="color"
                label="Couleur de l'arrière plan"
              />
            </div>
            <Typography variant="subtitle1">Arrière-plan</Typography>
            <TextField
              onChange={(e) =>
                this.updateTicketStyling(
                  "backgroundImage",
                  (e.target as any).files
                )
              }
              defaultValue={
                this.props.event.tickets[this.state.currentTicketSelected]
                  .styling.backgroundImage
              }
              className="single-input"
              type="file"
            />
            <Typography variant="subtitle1">Utiliser une bordure</Typography>
            <Switch
              value={
                this.props.event.tickets[this.state.currentTicketSelected]
                  .styling.useBorder
              }
              onChange={(e) =>
                this.updateTicketStyling("useBorder", e.target.checked)
              }
            />
          </div>
          <div className="EventCreator__customizeTickets__editor__confirm">
            <Button
              color="success"
              variant="contained"
              onClick={() => this.props.confirmTicketStyling(2)}
              id="confirm-styling"
            >
              Confirmer <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    );
  }
}

export default TicketCustomizer;
