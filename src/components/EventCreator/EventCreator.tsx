import {
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  TextField,
  styled,
  Typography,
  Input,
  IconButton,
  Button,
} from "@mui/material";
import React from "react";
import "./EventCreator.scss";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

class EventCreator extends React.Component {
  render() {
    const CssBox = styled(Box)(({ theme }) => ({
      ".EventCreator": {
        "&__title": {
          color: theme.palette.primary.dark,
        },
        "&__form": {
          ".MuiTypography-root": {
            color: theme.palette.primary.main,
          },
          "&__imageUpload": {
            ".image-upload-container": {
              borderColor: theme.palette.primary.light,
              svg: {
                color: theme.palette.primary.main,
              },
            },
          },
        },
      },
    }));
    return (
      <CssBox className="EventCreator">
        <div className="EventCreator__title">Créer un événement</div>
        <form>
          <FormGroup className="EventCreator__form">
            <div className="EventCreator__form__column">
              <Typography variant="subtitle1">Détails</Typography>
              <div className="EventCreator__form__input">
                <TextField id="event-name" label="Nom de l'événement" />
              </div>
              <div className="EventCreator__form__input">
                <TextField
                  id="event-code"
                  label="Code de l'événement (doit être unique)"
                />
              </div>
              <div className="EventCreator__form__input">
                <TextField
                  id="event-description"
                  minRows={3}
                  maxRows={3}
                  multiline
                  label="Description"
                />
              </div>
              <Typography
                className="EventCreator__form__sectionHeader"
                variant="subtitle1"
              >
                Billets
              </Typography>
              <div className="EventCreator__form__tickets">
                <div className="EventCreator__form__input">
                  <TextField className="small" label="Catégorie" />
                  <TextField className="small" label="Prix" type="number" />
                  <TextField className="small" label="Quantité" type="number" />
                </div>
                <div className="EventCreator__form__tickets__add">
                  <Button variant="outlined">
                    <AddIcon />
                  </Button>
                </div>
              </div>
            </div>
            <div className="EventCreator__form__column">
              <Box className="EventCreator__form__imageUpload">
                <label htmlFor="event-image" className="image-upload-container">
                  <AddAPhotoIcon />
                </label>
                <Input id="event-image" type="file" />
              </Box>
            </div>
          </FormGroup>

          <div className="EventCreator__submitContainer">
            <Button color="success" variant="contained" className="submit">
              Confirmer <ChevronRightIcon />
            </Button>
          </div>
        </form>
      </CssBox>
    );
  }
}

export default EventCreator;
