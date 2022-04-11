import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Event } from "../../interfaces/Event";
import "./EventCard.scss";

function EventCard({
  event,
  showLink,
}: {
  event: Event;
  showLink: boolean;
}) {
  let [imageToDisplay, setImageToDisplay] = useState(event.imageUrl);
  if (typeof event.imageUrl === "object") {
    var reader = new FileReader();

    reader.onload = function (e) {
      if (e.target && e.target.result) {
        setImageToDisplay(e.target.result as string);
      }
    };

    reader.readAsDataURL(event.imageUrl);
  }
  useEffect(() => {
    if (typeof event.imageUrl === "object") {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        if (e.target && e.target.result) {
          setImageToDisplay(e.target.result as string);
        }
      };
  
      reader.readAsDataURL(event.imageUrl);
    } else {
      setImageToDisplay(event.imageUrl);
    }
  }, [event])
  return (
    <Card className="EventCard">
      <CardMedia
        component={"img"}
        height="200"
        image={imageToDisplay as string}
        alt={event.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.description}
        </Typography>
      </CardContent>
      {showLink && (
        <CardActions>
          <Link to={"/events/" + event.$id}>
            <Button size="small">Voir les billets</Button>
          </Link>
        </CardActions>
      )}
    </Card>
  );
}

export default EventCard;
