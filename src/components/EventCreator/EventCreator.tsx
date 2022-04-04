import { Box, styled, Stepper, Step, StepLabel } from "@mui/material";
import React from "react";
import "./EventCreator.scss";
import Carousel from "react-material-ui-carousel";
import EventForm from "./EventForm/EventForm";
import TicketCustomizer from "./TicketCustomizer/TicketCustomizer";
import Event from "../../interfaces/Event";
import EventConfirmation from "./EventConfirmation/EventConfirmation";
import EventService from "../../services/EventService";
import { Navigate } from "react-router-dom";
import NFTicketTransactionService from "../../services/NFTicketTransactionService";

type EventCreatorProps = {};
type EventCreatorState = {
  currentStep: number;
  event: Event;
  hasCompletedEventCreation: boolean;
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
    const ticket = event.ticketCategories[index];
    if (ticket) {
      ticket.styling = ticketStyling;
    }
    this.setState({ event });
  }

  async createEvent() {
    // Create the ticket as NFT before saving to DB, and getting response with required data.
    const ticketsCategoryNFTs = NFTicketTransactionService.createTicketCategoryTransactionsFromEvent(this.state.event);
    let response = await NFTicketTransactionService.createTicketsAndValidate(ticketsCategoryNFTs);

    if(typeof(response) !== "undefined" && response?.success){
      // Find the template Id to save in the database, based on the response of the backend
      this.state.event.ticketCategories.forEach((category) => {
        category.atomicTemplateId = response.data.templates.find((template: any) => 
                  template.categoryName == category.type &&
                  template.originalPrice == category.price.toString() &&
                  template.locationName == this.state.event.locationName &&
                  template.name == this.state.event.name
        ).template_id;
        this.state.event.collName = response.data.collName;
      });

      const isEventCreated = await EventService.createNewEvent(this.state.event);

      if(isEventCreated) 
          this.setState({ hasCompletedEventCreation: true });
      else 
          alert("There was an issue creating the event, try again later")
    } else {
      console.log("Create Event had an error: " + response.errorMesssage);
    }
  }

  constructor(props: {}) {
    super(props);
    this.state = {
      event: {
        id: "",
        locationName: "",
        name: "",
        description: "",
        image: new Blob(),
        ticketCategories: [],
        locationAddress: "",
        dateTime: new Date(),
      },
      currentStep: 0,
      hasCompletedEventCreation: false,
    };
    this.handleEventFormSubmit = this.handleEventFormSubmit.bind(this);
    this.updateTicketStyling = this.updateTicketStyling.bind(this);
    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.createEvent = this.createEvent.bind(this);
    NFTicketTransactionService.getManager().restoreSession();
  }
  render() {
    return (
      <CssBox className="EventCreator">
        {this.state.hasCompletedEventCreation && <Navigate replace to="/" />}
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
                onClick={() => {
                  if (this.state.currentStep > 1) {
                    this.setCurrentStep(1);
                  }
                }}
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
          <div key="section-2">
            <EventConfirmation
              createEvent={this.createEvent}
              event={this.state.event}
            />
          </div>
        </Carousel>
      </CssBox>
    );
  }
}

export default EventCreator;
