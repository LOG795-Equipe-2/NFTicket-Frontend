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
import EventType from "../../interfaces/Event";
import "./EventCard.scss";

function EventCard({
  event,
  showLink,
}: {
  event: EventType;
  showLink: boolean;
}) {
  let [imageToDisplay, setImageToDisplay] = useState(event.image);
  if (typeof event.image === "object") {
    var reader = new FileReader();

    reader.onload = function (e) {
      if (e.target && e.target.result) {
        setImageToDisplay(e.target.result as string);
      }
    };

    reader.readAsDataURL(event.image);
  }
  useEffect(() => {
    if (typeof event.image === "object") {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        if (e.target && e.target.result) {
          setImageToDisplay(e.target.result as string);
        }
      };
  
      reader.readAsDataURL(event.image);
    } else {
      setImageToDisplay(event.image);
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
