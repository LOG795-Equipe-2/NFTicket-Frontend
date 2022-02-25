import {
  Box,
  TextField,
  styled,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import React from "react";
import "./EventCreator.scss";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactDOM from "react-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Carousel from "react-material-ui-carousel";

type EventCreatorProps = {};
type EventCreatorState = {
  tickets: TicketType[];
  eventImage: string;
  errors: any;
  isSubmitting: boolean;
  currentStep: number;
};
type TicketType = {
  type: string;
  price: number;
  amount: number;
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
  isSubmitting = false;

  handleEventSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      code: { value: string };
      description: { value: string };
    };
    let errors = this.state.errors;
    let hasErrors = false;
    const name = target.name.value;
    if (name.length === 0) {
      hasErrors = true;
      errors["event-name"] = "Le nom de l'événement est requis";
    }

    const code = target.code.value;
    if (code.length === 0) {
      hasErrors = true;
      errors["event-code"] = "Le code de l'événement est requis";
    }

    const description = target.description.value;
    if (description.length === 0) {
      hasErrors = true;
      errors["event-description"] = "La description de l'événement est requise";
    }

    const image = this.state.eventImage;
    if (image.length === 0) {
      hasErrors = true;
      errors["event-image"] = "Une image pour l'événement est requise";
    }

    const tickets = this.state.tickets;

    tickets.forEach((ticket, index) => {
      if (ticket.type.length === 0) {
        hasErrors = true;
        errors.tickets[index].type = "La catégorie du billet est requise";
      }
    });

    if (hasErrors) {
      this.setState({ errors });
    } else {
      this.setState({ isSubmitting: true });
      // Valider que le code est unique
      let nextButton = document.querySelector(
        '[aria-label="carousel indicator 2"]'
      ) as HTMLElement;
      if (nextButton) {
        setTimeout(() => {
          this.setState({ currentStep: 1, isSubmitting: false });
          nextButton.click();
        }, 2000);
      }
    }
  }

  addTicketType() {
    const { tickets, errors } = this.state;
    errors.tickets.push({});
    this.setState({
      tickets: [...tickets, { type: "", price: 0, amount: 1 }],
      errors,
    });
  }

  removeTicketType(index: number) {
    let tickets = [...this.state.tickets];
    const errors = this.state.errors;
    tickets.splice(index, 1);
    errors.tickets.splice(index, 1);
    this.setState({ tickets, errors });
  }

  handleTicketTypeChange(
    index: number,
    event: React.SyntheticEvent,
    name: string
  ) {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      value: any;
    };
    let tickets = this.state.tickets;
    (tickets[index] as any)[name] = target.value;
    if (target.value.length > 0) {
      const errors = this.state.errors;
      errors.tickets[index].type = "";
    }
    this.setState({ tickets });
  }

  handleImageUpload(event: React.SyntheticEvent) {
    const target = event.target as typeof event.target & {
      files: Blob[];
    };
    if (target.files && target.files.length) {
      const errors = this.state.errors;
      errors["event-image"] = "";
      let fr = new FileReader();
      fr.onload = () => {
        if (!!fr.result) {
          this.setState({ eventImage: fr.result as string, errors });
        }
      };
      fr.readAsDataURL(target.files[0]);
    }
  }

  handleImageUploadDragDrop(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = (event as any).dataTransfer.files;
    if (files && files.length && !this.state.isSubmitting) {
      const errors = this.state.errors;
      errors["event-image"] = "";
      let fr = new FileReader();
      fr.onload = () => {
        if (!!fr.result) {
          this.setState({ eventImage: fr.result as string, errors });
        }
      };
      fr.readAsDataURL(files[0]);
    }
  }

  handleImageUploadDragOver(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
    var node: any = ReactDOM.findDOMNode(this.imageUploadContainerRef.current);
    node.classList.add("drag-over");
  }

  handleImageUploadDragLeave() {
    var node: any = ReactDOM.findDOMNode(this.imageUploadContainerRef.current);
    node.classList.remove("drag-over");
  }

  handleEventInputChange(event: React.SyntheticEvent, key: string) {
    const target = event.target as typeof event.target & {
      value: string;
    };
    const { errors } = this.state;
    if (target.value.length > 0) {
      errors[key] = "";
      this.setState({ errors });
    }
  }

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

  constructor(props: {}) {
    super(props);
    this.state = {
      tickets: [{ type: "", price: 0, amount: 1 }],
      eventImage: "",
      errors: {
        tickets: [{}],
      },
      isSubmitting: false,
      currentStep: 0,
    };
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
          <form
            key="section-0"
            id="event-form"
            onSubmit={(e) => this.handleEventSubmit(e)}
          >
            <div className="EventCreator__form">
              <div className="EventCreator__form__column">
                <Typography variant="subtitle1">Détails</Typography>
                <div className="EventCreator__form__input">
                  <TextField
                    id="event-name"
                    label="Nom de l'événement"
                    name="name"
                    helperText={this.state.errors["event-name"]}
                    error={!!this.state.errors["event-name"]}
                    onChange={(e) =>
                      this.handleEventInputChange(e, "event-name")
                    }
                    disabled={this.state.isSubmitting}
                  />
                </div>
                <div className="EventCreator__form__input">
                  <TextField
                    id="event-code"
                    label="Code de l'événement (doit être unique)"
                    name="code"
                    helperText={this.state.errors["event-code"]}
                    error={!!this.state.errors["event-code"]}
                    onChange={(e) =>
                      this.handleEventInputChange(e, "event-code")
                    }
                    disabled={this.state.isSubmitting}
                  />
                </div>
                <div className="EventCreator__form__input">
                  <TextField
                    id="event-description"
                    minRows={3}
                    maxRows={3}
                    multiline
                    label="Description"
                    name="description"
                    helperText={this.state.errors["event-description"]}
                    error={!!this.state.errors["event-description"]}
                    onChange={(e) =>
                      this.handleEventInputChange(e, "event-description")
                    }
                    disabled={this.state.isSubmitting}
                  />
                </div>
                <Typography
                  className="EventCreator__form__sectionHeader"
                  variant="subtitle1"
                >
                  Billets
                </Typography>
                <div className="EventCreator__form__tickets">
                  {this.state.tickets.map((ticket, index) => (
                    <div className="EventCreator__form__input" key={index}>
                      <TextField
                        className="small"
                        label="Catégorie"
                        name="type"
                        onChange={(e) =>
                          this.handleTicketTypeChange(index, e, "type")
                        }
                        value={ticket.type}
                        helperText={this.state.errors.tickets[index].type}
                        error={!!this.state.errors.tickets[index].type}
                        disabled={this.state.isSubmitting}
                      />
                      <TextField
                        value={ticket.price}
                        className="small"
                        label="Prix"
                        type="number"
                        name="price"
                        InputProps={{ inputProps: { min: 0 } }}
                        onChange={(e) =>
                          this.handleTicketTypeChange(index, e, "price")
                        }
                        disabled={this.state.isSubmitting}
                      />
                      <TextField
                        className="small"
                        label="Quantité"
                        type="number"
                        value={ticket.amount}
                        name="amount"
                        InputProps={{ inputProps: { min: 1 } }}
                        onChange={(e) =>
                          this.handleTicketTypeChange(index, e, "amount")
                        }
                        disabled={this.state.isSubmitting}
                      />
                      {index === 0 ? (
                        <div style={{ width: "64px" }} />
                      ) : (
                        <Button
                          onClick={() => this.removeTicketType(index)}
                          variant="outlined"
                          className="EventCreator__form__tickets__remove"
                          disabled={this.state.isSubmitting}
                        >
                          <DeleteIcon />
                        </Button>
                      )}
                    </div>
                  ))}

                  <div className="EventCreator__form__tickets__add">
                    <Button
                      onClick={() => this.addTicketType()}
                      variant="outlined"
                      disabled={this.state.isSubmitting}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="EventCreator__form__column">
                <Box className="EventCreator__form__imageUpload">
                  <label
                    ref={this.imageUploadContainerRef}
                    htmlFor="event-image"
                    onDragOver={(e) => this.handleImageUploadDragOver(e)}
                    onDragLeave={() => this.handleImageUploadDragLeave()}
                    onDrop={(e) => this.handleImageUploadDragDrop(e)}
                    className={
                      "image-upload-container " +
                      (this.state.errors["event-image"] ? "error" : "")
                    }
                    style={{
                      borderWidth: this.state.eventImage === "" ? "2px" : "0px",
                    }}
                  >
                    {this.state.eventImage === "" ? (
                      <AddAPhotoIcon />
                    ) : (
                      <img src={this.state.eventImage} />
                    )}
                  </label>
                  <input
                    id="event-image"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => this.handleImageUpload(e)}
                    disabled={this.state.isSubmitting}
                  />
                  <p className="error-helper-text">
                    {this.state.errors["event-image"]}
                  </p>
                </Box>
              </div>
            </div>
            <div className="EventCreator__submitContainer">
              <Button
                color="success"
                type="submit"
                variant="contained"
                form="event-form"
                disabled={this.state.isSubmitting}
              >
                {this.state.isSubmitting ? (
                  <CircularProgress size={20} />
                ) : (
                  <React.Fragment>
                    Confirmer <ChevronRightIcon />
                  </React.Fragment>
                )}
              </Button>
            </div>
          </form>
          <div key="section-1">billets</div>
          <div key="section-2">autre chose</div>
        </Carousel>
      </CssBox>
    );
  }
}

export default EventCreator;
