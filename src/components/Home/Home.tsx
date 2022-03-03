import { Box, Button, styled, Typography } from "@mui/material";
import "./Home.scss";
import SearchBox from "./SearchBox/SearchBox";
import StarIcon from "@mui/icons-material/Star";
import FeaturedEventsCarousel from "./FeaturedEventsCarousel/FeaturedEventsCarousel";
import NearbyEventsCarousel from "./NearbyEventsCarousel/NearbyEventsCarousel";
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";
import { NavLink } from "react-router-dom";

function Home() {
  const CssBox = styled(Box)(({ theme }) => ({
    ".home": {
      "&__splashScreen": {
        background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        "&__title": {
          "&__main": {
            color: theme.palette.primary.light,
          },
        },
        "&__featuredEvents": {
          "&__title": {
            color: theme.palette.secondary.light,
          },
        },
      },
      "&__search": {
        "&__title": {
          color: theme.palette.primary.dark,
        },
      },
      "&__nearbyEvents": {
        "&__title": {
          color: theme.palette.primary.dark,
        },
      },
      "&__createEvent": {
        "&__title": {
          color: theme.palette.primary.dark,
        },
      },
    },
  }));
  return (
    <CssBox className="home">
      <div className="home__splashScreen">
        <div className="home__splashScreen__title">
          <div className="home__splashScreen__title__main">
            Pour un billet aussi unique que votre expérience.
          </div>
          <div className="home__splashScreen__title__sub"></div>
        </div>
        <div className="home__splashScreen__featuredEvents">
          <div className="home__splashScreen__featuredEvents__title">
            <StarIcon></StarIcon>
            Événements en vedette
          </div>
          <FeaturedEventsCarousel></FeaturedEventsCarousel>
        </div>
      </div>
      <div className="home__search">
        <div className="home__search__title">Recherche d'événements</div>
        <SearchBox />
      </div>
      <div className="home__nearbyEvents">
        <div className="home__nearbyEvents__title">Événements à proximité</div>
        <NearbyEventsCarousel />
      </div>
      <div className="home__createEvent">
        <div className="home__createEvent__title">Créer un événement</div>

        <div className="home__createEvent__subtitle">
          <Typography variant="body2" color="text.secondary">
            Hébergez votre événement sur NFTicket et offrez à votre public des
            billets uniques. Vos plus grands fans pourront collectionner vos
            billets et obtenir des récompenses.
          </Typography>
        </div>
        <div className="home__createEvent__content">
          <NavLink to="create">
            <Button color="success" variant="contained">
              Créer votre événement
              <ConfirmationNumber />
            </Button>
          </NavLink>
        </div>
      </div>
    </CssBox>
  );
}

export default Home;
