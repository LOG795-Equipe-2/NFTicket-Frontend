import { Box, CircularProgress, Paper, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect } from "react";
import Event from "../../../interfaces/Event";
import TicketCategory from "../../../interfaces/TicketCategory";
import EventService from "../../../services/EventService";
import EventCard from "../../EventCard/EventCard";

export default function MyEventsView() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(true);
  const [ticketCategories, setTicketCategories] = React.useState<
    TicketCategory[]
  >([]);
  useEffect(() => {
    EventService.getMyEvents().then((response) => {
      setEvents(response.documents as any);
      EventService.getTicketCategoriesForEvent(
        (events[0] as any)["$id"] as string
      ).then((categories) => {
        console.log(categories);
      });
      setIsFetching(false);
    });
  }, []);

  const handleSelectedEventChange = (_: any, newValue: any) => {
    setTicketCategories([]);
    setSelectedEvent(newValue);
    if (events[selectedEvent]) {
      EventService.getTicketCategoriesForEvent(
        (events[selectedEvent] as any)["$id"] as string
      ).then((categories) => {
        console.log((events[selectedEvent] as any)["$id"]);
      });
    }
  };

  return (
    <Box>
      {isFetching ? (
        <CircularProgress size={25} />
      ) : (
        <Stack direction="column" spacing={4}>
          <Paper>
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
            <Stack direction="row">
              <Box sx={{ width: 300 }}>
                <EventCard showLink={false} event={events[selectedEvent]} />
              </Box>
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
