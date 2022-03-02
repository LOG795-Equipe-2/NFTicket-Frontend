import Carousel from "react-material-ui-carousel";
import EventCard from "../../EventCard/EventCard";
import { Box } from "@mui/material";
import eventService from "../../../services/EventService";

function FeaturedEventsCarousel() {
  const eventGroups = eventService.getCurrentFeaturedEvents(4, 12);
  return (
    <Carousel interval={10000} navButtonsAlwaysVisible animation="slide">
      {eventGroups.map((eventGroup, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            margin: "30px 40px",
          }}
        >
          {eventGroup.map(event => (
            <EventCard key={event.id} event={event}/>
          ))}
        </Box>
      ))}
    </Carousel>
  );
}

export default FeaturedEventsCarousel;
