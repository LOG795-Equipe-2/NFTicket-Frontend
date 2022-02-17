import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import EventType from "../../interfaces/Event";

function EventCard({ event }: { event: EventType}) {
  return (
    <Card sx={{ maxWidth: 350, margin: "0 20px" }}>
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
      <CardActions>
        <Button size="small">Voir les billets</Button>
      </CardActions>
    </Card>
  );
}

export default EventCard;
