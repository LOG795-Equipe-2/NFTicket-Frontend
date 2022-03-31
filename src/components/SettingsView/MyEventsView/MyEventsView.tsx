import { Box, CircularProgress, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Event from "../../../interfaces/Event";
import TicketCategoryModel from "../../../interfaces/TicketCategory";
import EventService from "../../../services/EventService";
import EventCard from "../../EventCard/EventCard";
import TicketVisualiser from "../../TicketVisualiser/TicketVisualiser";

export default function MyEventsView() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(true);
  const [ticketCategories, setTicketCategories] = React.useState<
    TicketCategoryModel[]
  >([]);
  useEffect(() => {
    EventService.getMyEvents().then((response) => {
      setEvents(response.documents as any);
      setSelectedEvent(0);
      if (response.documents.length > 0) {
        EventService.getTicketCategoriesForEvent(
          (response.documents[0] as any)["$id"] as string
        ).then((categories) => {
          setTicketCategories(categories as any[])
          setIsFetching(false);
        });
      } else {
        setIsFetching(false);
      }
    });
  }, []);

  const handleSelectedEventChange = (_: any, newValue: any) => {
    setTicketCategories([]);
    setSelectedEvent(newValue);
    if (events[selectedEvent]) {
      EventService.getTicketCategoriesForEvent(
        (events[newValue] as any)["$id"] as string
      ).then((categories) => {
        setTicketCategories(categories as any[])
      });
    }
  };

  return (
    <Box>
      {isFetching ? (
        <CircularProgress size={25} />
      ) : (
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
                <EventCard key={events[selectedEvent].id} showLink={false} event={events[selectedEvent]} />
              </Box>
              <Stack direction="column">
                {ticketCategories.map((category: any) => (
                  <Stack key={category["$id"]} spacing={2} direction="row">
                    <TicketVisualiser size="small" event={events[selectedEvent]} ticket={category} />
                    <Stack spacing={2} direction="column">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>Billets vendus: <Typography color="primary" sx={{ margin: '0 5px' }} variant="h5">{category.initialQuantity - (category.remainingQuantity || 0)}</Typography> de <Typography color="primary" sx={{ margin: '0 5px' }} variant="h5">{category.initialQuantity}</Typography></Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>Ventes: <Typography sx={{ marginLeft: '5px' }} color="primary" variant='h5'>{((category.initialQuantity - (category.remainingQuantity || 0)) * category.price).toFixed(2)}$</Typography></Box>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
