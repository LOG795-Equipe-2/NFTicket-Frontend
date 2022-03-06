import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
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
  return (
    <Card className="EventCard" sx={{ maxWidth: 350, margin: "0 20px" }}>
      <CardMedia
        component={"img"}
        height="200"
        image={process.env.PUBLIC_URL + event.image}
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
          <Link to={"/events/" + event.id}>
            <Button size="small">Voir les billets</Button></Link>
        </CardActions>
      )}
    </Card>
  );
}

export default EventCard;
