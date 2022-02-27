import {
  Box,
  styled,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import React from "react";
import "./EventCreator.scss";
import Carousel from "react-material-ui-carousel";
import EventForm from "./EventForm/EventForm";
import Ticket from "../../interfaces/Ticket";
import TicketCustomizer from "./TicketCustomizer/TicketCustomizer";

type EventCreatorProps = {};
type EventCreatorState = {
  currentStep: number;
  tickets: Ticket[];
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
  },
}));
class EventCreator extends React.Component<
  EventCreatorProps,
  EventCreatorState
> {
  imageUploadContainerRef = React.createRef<any>();

  setCurrentStep(step: number) {
    if (step < this.state.currentStep) {
      let previousButton = document.querySelector(
        `[aria-label="carousel indicator ${step + 1}"]`
      ) as HTMLElement;
      if (previousButton) {
        previousButton.click();
      }
      this.setState({ currentStep: step });
    }
  }

  handleEventFormSubmit(tickets: Ticket[]) {
    this.setState({ tickets, currentStep: 1 });
    let nextButton = document.querySelector(
      '[aria-label="carousel indicator 2"]'
    ) as HTMLElement;
    if (nextButton) {
      nextButton.click();
    }
  }

  constructor(props: {}) {
    super(props);
    this.state = {
      tickets: [],
      currentStep: 0,
    };
    this.handleEventFormSubmit = this.handleEventFormSubmit.bind(this);
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
              <div className="text">
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
          <TicketCustomizer tickets={this.state.tickets} />
          <div key="section-2"></div>
        </Carousel>
      </CssBox>
    );
  }
}

export default EventCreator;
