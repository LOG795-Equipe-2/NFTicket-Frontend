import { Box, styled } from "@mui/material";
import "./Home.scss";
import SearchBox from "./SearchBox/SearchBox";
import StarIcon from "@mui/icons-material/Star";
import FeaturedEventsCarousel from "./FeaturedEventsCarousel/FeaturedEventsCarousel";

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
            Évenements en vedette
          </div>
          <FeaturedEventsCarousel></FeaturedEventsCarousel>
        </div>
      </div>
      <div className="home__search">
        <div className="home__search__title">Recherche d'évenements</div>
        <SearchBox />
      </div>
      <div className="home__closeByEvents"></div>
    </CssBox>
  );
}

export default Home;
