import Carousel from "react-material-ui-carousel";
import EventCard from "../../EventCard/EventCard";
import { Box } from "@mui/material";
import eventService from "../../../services/EventService";
import { useEffect, useState } from "react";
import Event from "../../../interfaces/Event";

function FeaturedEventsCarousel() {
  const [events, setEvents] = useState<Event[][]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const fetchedEvents = await eventService.getCurrentFeaturedEvents(2, 12, "testCity");
      setEvents(fetchedEvents);
    }

    fetchEvents();
  }, []);

  return (
    <Carousel interval={10000} navButtonsAlwaysVisible animation="slide">
      {events.map((eventGroup, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            margin: "30px 40px",
          }}
        >
          {eventGroup.map((event, index) => (
            <EventCard showLink key={event.name + index + "_featured"} event={event}/>
          ))}
        </Box>
      ))}
    </Carousel>
  );
}

export default FeaturedEventsCarousel;
