import Carousel from "react-material-ui-carousel";
import EventCard from "../../EventCard/EventCard";
import { Box } from "@mui/material";
import eventService from "../../../services/EventService";

function NearbyEventsCarousel() {
  const eventGroups = eventService.getNearbyEvents(4, 12, "x1x1x1");
  console.log(eventGroups)
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
            <EventCard showLink key={event.name} event={event}/>
          ))}
        </Box>
      ))}
    </Carousel>
  );
}

export default NearbyEventsCarousel;
