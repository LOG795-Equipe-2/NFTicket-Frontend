import React from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ReactDOM from "react-dom";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import TicketCategory from "../../../interfaces/TicketCategory";
import Event from "../../../interfaces/Event";

type EventFormProps = {
  moveToNextStep: Function;
};
type EventFormState = {
  ticketCategories: TicketCategory[];
  errors: any;
  eventImage: string;
  isSubmitting: boolean;
};

class EventForm extends React.Component<EventFormProps, EventFormState> {
  imageUploadContainerRef = React.createRef<any>();

  constructor(props: EventFormProps) {
    super(props);
    this.state = {
      ticketCategories: [
        {
          type: "",
          price: 0,
          initialAmount: 1,
          styling: {
            primaryColor: "#FFFFFF",
            secondaryColor: "#FFFFFF",
            backgroundColor: "#000000",
            backgroundImage: "",
            useBorder: false,
          },
        },
      ],
      eventImage: "",
      errors: {
        tickets: [{}],
      },
      isSubmitting: false,
    };
  }

  addTicketType() {
    const { ticketCategories, errors } = this.state;
    errors.tickets.push({});
    this.setState({
      ticketCategories: [
        ...ticketCategories,
        {
          type: "",
          price: 0,
          initialAmount: 1,
          styling: {
            primaryColor: "#FFFFFF",
            secondaryColor: "#FFFFFF",
            backgroundColor: "#000000",
            backgroundImage: "",
            useBorder: false,
          },
        },
      ],
      errors,
    });
  }

  removeTicketType(index: number) {
    let ticketCategories = [...this.state.ticketCategories];
    const errors = this.state.errors;
    ticketCategories.splice(index, 1);
    errors.tickets.splice(index, 1);
    this.setState({ ticketCategories, errors });
  }

  handleTicketTypeChange(
    index: number,
    event: React.SyntheticEvent,
    name: string
  ) {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      value: any;
      valueAsNumber: number;
    };
    let ticketCategories = this.state.ticketCategories;
    if (name === "price" || name == "amount") {
      (ticketCategories[index] as any)[name] = target.valueAsNumber;
    } else {
      (ticketCategories[index] as any)[name] = target.value;
    }
    if (target.value.length > 0) {
      const errors = this.state.errors;
      errors.tickets[index].type = "";
    }
    this.setState({ ticketCategories });
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

  handleEventSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      location: { value: string };
      description: { value: string };
      address: { value: string };
    };
    let errors = this.state.errors;
    let hasErrors = false;
    const name = target.name.value;
    if (name.length === 0) {
      hasErrors = true;
      errors["event-name"] = "Le nom de l'événement est requis";
    }

    const location = target.location.value;
    if (location.length === 0) {
      hasErrors = true;
      errors["event-location"] = "L'endroit de l'événement est requis";
    }

    const adress = target.address.value;
    if (adress.length === 0) {
      hasErrors = true;
      errors["event-address"] = "L'endroit de l'événement est requis";
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

    const tickets = this.state.ticketCategories;

    tickets.forEach((ticketCategory, index) => {
      if (ticketCategory.type.length === 0) {
        hasErrors = true;
        errors.tickets[index].type = "La catégorie du billet est requise";
      }
    });

    if (hasErrors) {
      this.setState({ errors });
    } else {
      this.setState({ isSubmitting: true });
      // Valider que le location est unique
      let nextButton = document.querySelector(
        '[aria-label="carousel indicator 2"]'
      ) as HTMLElement;
      if (nextButton) {
        setTimeout(() => {
          this.setState({
            isSubmitting: false,
          });
          const event: Event = {
            locationName: location,
            locationAddress: adress,
            name,
            description,
            image,
            ticketCategories: this.state.ticketCategories,
            id: "",
            dateTime: new Date()
          };
          this.props.moveToNextStep(event);
          nextButton.click();
        }, 2000);
      }
    }
  }

  render() {
    return (
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
                onChange={(e) => this.handleEventInputChange(e, "event-name")}
                disabled={this.state.isSubmitting}
              />
            </div>
            <div className="EventCreator__form__input">
              <TextField
                id="event-location"
                label="Endroit"
                name="location"
                helperText={this.state.errors["event-location"]}
                error={!!this.state.errors["event-location"]}
                onChange={(e) => this.handleEventInputChange(e, "event-location")}
                disabled={this.state.isSubmitting}
              />
            </div>
            <div className="EventCreator__form__input">
              <TextField
                id="event-address"
                label="Adresse"
                name="address"
                helperText={this.state.errors["event-address"]}
                error={!!this.state.errors["event-address"]}
                onChange={(e) => this.handleEventInputChange(e, "event-address")}
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
              {this.state.ticketCategories.map((ticketCategory, index) => (
                <div className="EventCreator__form__input" key={index}>
                  <TextField
                    className="small"
                    label="Catégorie"
                    name="type"
                    onChange={(e) =>
                      this.handleTicketTypeChange(index, e, "type")
                    }
                    value={ticketCategory.type}
                    helperText={this.state.errors.tickets[index].type}
                    error={!!this.state.errors.tickets[index].type}
                    disabled={this.state.isSubmitting}
                  />
                  <TextField
                    value={ticketCategory.price}
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
                    value={ticketCategory.initialAmount}
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
    );
  }
}
export default EventForm;
