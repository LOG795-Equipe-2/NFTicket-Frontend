import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

function EventCard({ imageLink }: { imageLink: string }) {
  return (
    <Card sx={{ maxWidth: 350, margin: "0 20px" }}>
      <CardMedia
        component={"img"}
        height="200"
        image={imageLink}
        alt="something"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Voir les billets</Button>
      </CardActions>
    </Card>
  );
}

EventCard.propTypes = {
  imageLink: PropTypes.string,
};

export default EventCard;
