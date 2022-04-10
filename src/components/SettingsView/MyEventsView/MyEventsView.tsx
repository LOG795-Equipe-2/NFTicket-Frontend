import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React, { useEffect } from "react";
import Event from "../../../interfaces/Event";
import TicketCategoryModel from "../../../interfaces/TicketCategory";
import BouncerService from "../../../services/BouncerService";
import EventService from "../../../services/EventService";
import EventCard from "../../EventCard/EventCard";
import TicketVisualiser from "../../TicketVisualiser/TicketVisualiser";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import { SnackbarMessage } from "../../../interfaces/MUIIntefaces";

export default function MyEventsView() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(true);
  const [ticketCategories, setTicketCategories] = React.useState<
    TicketCategoryModel[]
  >([]);
  const [bouncerQuantity, setBouncerQuantity] = React.useState(1);
  const [openBouncers, setOpenBouncers] = React.useState(false);
  const [bouncers, setBouncers] = React.useState<string[]>([]);
  const [snackbarContent, setSnackbarContent] = React.useState<
    SnackbarMessage | undefined
  >(undefined);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  const showBouncers = () => {
    setOpenBouncers(!openBouncers);
  };

  useEffect(() => {
    EventService.getMyEvents().then((response) => {
      setEvents(response.documents as any);
      setSelectedEvent(0);

      if (response.documents.length > 0) {
        fetchBouncers(response.documents[0].$id);
        EventService.getTicketCategoriesForEvent(
          (response.documents[0] as any)["$id"] as string
        ).then((categories) => {
          setTicketCategories(categories as any[]);
          setIsFetching(false);
        });
      } else {
        setIsFetching(false);
      }
    });
  }, []);

  const fetchBouncers = async (eventId: string) => {
    BouncerService.getBouncers(eventId).then((res) => {
      if (res.success) setBouncers(res.data);
    });
  };

  const onBouncerQuantityChange = (e: any) => {
    setBouncerQuantity(parseInt(e.target.value));
  };

  const addBouncer = () => {
    BouncerService.createBouncers(
      events[selectedEvent].$id,
      bouncerQuantity
    ).then((res) => {
      if (res.success) setBouncers(res.data);
    });
  };

  const deleteBouncer = async (
    bouncer: string,
    reloadAfter: boolean = true
  ) => {
    const res = await BouncerService.deleteBouncer(
      events[selectedEvent].$id,
      bouncer
    );
    if (res.success && reloadAfter)
      await fetchBouncers(events[selectedEvent].$id);
  };

  const deleteAllBouncers = async () => {
    for (let i = 0; i < bouncers.length; i++) {
      await deleteBouncer(bouncers[i], false);
    }
    fetchBouncers(events[selectedEvent].$id);
  };

  const copyBouncerUrl = (bouncer: string) => {
    let url =
      window.location.host +
      "/validator/" +
      events[selectedEvent].$id +
      "/" +
      bouncer;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
      setSnackbarContent({
        type: "info",
        message: "Lien de validateur copié sur le presse-papier!",
      });
    }
  };

  const handleSelectedEventChange = (_: any, newValue: any) => {
    setTicketCategories([]);
    setSelectedEvent(newValue);
    setBouncers([]);
    setOpenBouncers(false);
    if (events[newValue]) {
      fetchBouncers(events[newValue].$id);
      EventService.getTicketCategoriesForEvent(
        (events[newValue] as any)["$id"] as string
      ).then((categories) => {
        setTicketCategories(categories as any[]);
      });
    }
  };

  return (
    <Box>
      {isFetching ? (
        <CircularProgress size={25} />
      ) : (
        <>
          <Snackbar
            open={!!snackbarContent}
            autoHideDuration={6000}
            onClose={() => setSnackbarContent(undefined)}
          >
            {snackbarContent && (
              <Alert
                onClose={() => setSnackbarContent(undefined)}
                severity={snackbarContent.type}
              >
                {snackbarContent.message}
              </Alert>
            )}
          </Snackbar>
          <Stack direction="column" spacing={4}>
            <Paper sx={{ width: 802 }}>
              <Tabs
                onChange={handleSelectedEventChange}
                value={selectedEvent}
                variant="scrollable"
                scrollButtons="auto"
              >
                {events.map((event: Event) => (
                  <Tab key={(event as any)["$id"]} label={event.name} />
                ))}
              </Tabs>
            </Paper>
            <Box>
              <Stack direction="row" spacing={2}>
                <Box sx={{ width: 300 }}>
                  <EventCard
                    key={events[selectedEvent].$id}
                    showLink={false}
                    event={events[selectedEvent]}
                  />
                </Box>
                <Stack direction="column">
                  {ticketCategories.map((category: any) => (
                    <Stack key={category["$id"]} spacing={2} direction="row">
                      <TicketVisualiser
                        size="small"
                        event={events[selectedEvent]}
                        ticket={category}
                      />
                      <Stack spacing={2} direction="column">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Billets vendus:{" "}
                          <Typography
                            color="primary"
                            sx={{ margin: "0 5px" }}
                            variant="h5"
                          >
                            {category.initialQuantity -
                              (category.remainingQuantity || 0)}
                          </Typography>{" "}
                          de{" "}
                          <Typography
                            color="primary"
                            sx={{ margin: "0 5px" }}
                            variant="h5"
                          >
                            {category.initialQuantity}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Ventes:{" "}
                          <Typography
                            sx={{ marginLeft: "5px" }}
                            color="primary"
                            variant="h5"
                          >
                            {(
                              (category.initialQuantity -
                                (category.remainingQuantity || 0)) *
                              category.price
                            ).toFixed(2)}
                            $
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  className="small"
                  label="Quantité"
                  type="number"
                  name="quantity"
                  InputProps={{ inputProps: { min: 1 } }}
                  onChange={(e) => onBouncerQuantityChange(e)}
                />
                <Button
                  color="info"
                  variant="contained"
                  onClick={() => addBouncer()}
                >
                  Ajouter Validateurs
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  Supprimer tous les Validateurs
                </Button>
              </Stack>
              <Paper sx={{ marginBottom: '20px!important' }}>
                <List>
                  <ListItemButton onClick={showBouncers}>
                    <ListItemText primary="Validateurs" />
                    {openBouncers ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openBouncers} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {bouncers.map((b: string) => (
                        <ListItem key={b} sx={{ pl: 4 }}>
                          <ListItemText primary={b} />
                          <IconButton
                            edge="end"
                            aria-label="comments"
                            sx={{ marginRight: "10px" }}
                            onClick={() => copyBouncerUrl(b)}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="comments"
                            onClick={() => deleteBouncer(b)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </List>
              </Paper>
            </Stack>
          </Stack>
          <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Cette action est non-réversible. Procéder?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  deleteAllBouncers();
                  setConfirmDialogOpen(false);
                }}
                autoFocus
              >
                Continuer
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
