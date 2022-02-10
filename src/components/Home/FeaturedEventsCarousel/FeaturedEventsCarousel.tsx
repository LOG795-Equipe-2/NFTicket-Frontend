import Carousel from "react-material-ui-carousel";
import EventCard from "../../EventCard/EventCard";
import image1 from "../../../assets/img/placeholder/1.jpg";
import image2 from "../../../assets/img/placeholder/2.jpg";
import image3 from "../../../assets/img/placeholder/3.jpg";
import image4 from "../../../assets/img/placeholder/4.jpg";
import { Box } from "@mui/material";

function FeaturedEventsCarousel() {
  return (
    <Carousel interval={10000} navButtonsAlwaysVisible animation="slide">
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: "30px 40px" }}>
        <EventCard imageLink={image1}></EventCard>
        <EventCard imageLink={image2}></EventCard>
        <EventCard imageLink={image3}></EventCard>
        <EventCard imageLink={image4}></EventCard>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: "30px 40px" }}>
        <EventCard imageLink={image1}></EventCard>
        <EventCard imageLink={image2}></EventCard>
        <EventCard imageLink={image3}></EventCard>
        <EventCard imageLink={image4}></EventCard>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: "30px 40px" }}>
        <EventCard imageLink={image1}></EventCard>
        <EventCard imageLink={image2}></EventCard>
        <EventCard imageLink={image3}></EventCard>
        <EventCard imageLink={image4}></EventCard>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: "30px 40px" }}>
        <EventCard imageLink={image1}></EventCard>
        <EventCard imageLink={image2}></EventCard>
        <EventCard imageLink={image3}></EventCard>
        <EventCard imageLink={image4}></EventCard>
      </Box>
    </Carousel>
  );
}

export default FeaturedEventsCarousel;
