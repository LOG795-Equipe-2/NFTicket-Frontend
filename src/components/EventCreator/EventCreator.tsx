import { Box, styled, Stepper, Step, StepLabel } from "@mui/material";
import React from "react";
import "./EventCreator.scss";
import Carousel from "react-material-ui-carousel";
import EventForm from "./EventForm/EventForm";
import TicketCustomizer from "./TicketCustomizer/TicketCustomizer";
import Event from "../../interfaces/Event";

type EventCreatorProps = {};
type EventCreatorState = {
  currentStep: number;
  event: Event;
};
const CssBox = styled(Box)(({ theme }) => ({
  ".EventCreator": {
    "&__title .text .MuiStepLabel-label": {
      color: theme.palette.primary.dark,
    },
    "&__form": {
      ".MuiTypography-root": {
        color: theme.palette.primary.main,
      },
      "&__imageUpload": {
        ".error-helper-text": {
          color: theme.palette.error.main,
        },
        ".image-upload-container": {
          borderColor: theme.palette.primary.light,
          svg: {
            color: theme.palette.primary.main,
          },
          "&.drag-over": {
            borderColor: theme.palette.primary.main,
          },
          "&.error": {
            borderColor: theme.palette.error.main,
            svg: {
              color: theme.palette.error.main,
            },
          },
        },
      },
    },
    "&__submitContainer": {
      ".MuiButton-root": {
        ".MuiCircularProgress-root": {
          color: theme.palette.primary.main,
        },
      },
    },
    "&__customizeTickets": {
      "&__editor": {
        "&__fields": {
          ".MuiTypography-root": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
  },
}));
class EventCreator extends React.Component<
  EventCreatorProps,
  EventCreatorState
> {
  imageUploadContainerRef = React.createRef<any>();

  setCurrentStep(step: number) {
    let button = document.querySelector(
      `[aria-label="carousel indicator ${step + 1}"]`
    ) as HTMLElement;
    if (button) {
      button.click();
    }
    this.setState({ currentStep: step });
  }

  handleEventFormSubmit(event: Event) {
    this.setState({ event, currentStep: 1 });
    let nextButton = document.querySelector(
      '[aria-label="carousel indicator 2"]'
    ) as HTMLElement;
    if (nextButton) {
      nextButton.click();
    }
  }

  updateTicketStyling(index: number, ticketStyling: any) {
    const event = this.state.event;
    const ticket = event.tickets[index];
    if (ticket) {
      ticket.styling = ticketStyling;
    }
    this.setState({ event });
  }

  constructor(props: {}) {
    super(props);
    this.state = {
      event: {
        id: "",
        name: "",
        description: "",
        image: "",
        tickets: [],
      },
      currentStep: 0,
    };
    this.handleEventFormSubmit = this.handleEventFormSubmit.bind(this);
    this.updateTicketStyling = this.updateTicketStyling.bind(this);
    this.setCurrentStep = this.setCurrentStep.bind(this);
  }
  render() {
    return (
      <CssBox className="EventCreator">
        <div className="EventCreator__title">
          <Stepper activeStep={this.state.currentStep}>
            <Step>
              <div
                onClick={() => this.setCurrentStep(0)}
                className={`text ${this.state.currentStep > 0 && "previous"}`}
              >
                <StepLabel>Créer un événement</StepLabel>
              </div>
            </Step>
            <Step>
              <div
                onClick={() => this.setCurrentStep(1)}
                className={`text ${this.state.currentStep > 1 && "previous"}`}
              >
                <StepLabel>Personnaliser les billets</StepLabel>
              </div>
            </Step>
            <Step>
              <div className="text">
                <StepLabel>Confirmer</StepLabel>
              </div>
            </Step>
          </Stepper>
        </div>
        <Carousel
          sx={{ width: "min(80%, 1800px)" }}
          className="carousel"
          animation="slide"
          navButtonsAlwaysInvisible
          indicators={true}
          autoPlay={false}
          swipe={false}
        >
          <EventForm moveToNextStep={this.handleEventFormSubmit} />
          <TicketCustomizer
            confirmTicketStyling={this.setCurrentStep}
            updateTicketStyling={this.updateTicketStyling}
            event={this.state.event}
          />
          <div key="section-2">Confirm</div>
        </Carousel>
      </CssBox>
    );
  }
}

export default EventCreator;
