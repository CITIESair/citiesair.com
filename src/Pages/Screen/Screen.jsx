// disable eslint for this file
/* eslint-disable */
import { Container, Grid, Typography, Paper, SvgIcon, List, ListItem, ListItemText } from '@mui/material';

const Screen = () => {

  return (
    <Grid container alignContent="stretch" alignItems="stretch">
      <Grid item id="left-wrapper" xs={6} className="bg-dark" sx={{
        py: "5vh"
      }}>
        <Container className="text-center d-flex flex-column justify-content-between h-100">
          <div id="left-title" className="row">
            <Typography variant="h2" className="mb-0">
              PM2.5 AIR QUALITY INDEX
            </Typography>
            <Typography variant="h4">
              Particulate Matter &lt; 2.5μm
            </Typography>
          </div>

          <div id="aqi-wrapper" className="row">
            <Grid item id="indoors" xs={6}>
              <Typography variant="h3" className="location" data-category=""></Typography>
              <Typography variant="h1" className="aqi-index" data-category="">
                --
              </Typography>
              <Typography variant="h3" className="aqi-category" data-category="">
                --
              </Typography>
              <Typography variant="h5" className="sensor-status" data-category="">
                Sensor offline
              </Typography>
            </Grid>
            <Grid item id="outdoors" xs={6}>
              <Typography variant="h3" className="location" data-category=""></Typography>
              <Typography variant="h1" className="aqi-index" data-category="">
                --
              </Typography>
              <Typography variant="h3" className="aqi-category" data-category="">
                --
              </Typography>
              <Typography variant="h5" className="sensor-status" data-category="">
                Sensor offline
              </Typography>
              <Typography variant="h3" className="weather" style={{ marginBottom: 0 }}>
                <span className="temperature">
                  <SvgIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
                    fill="rgb(200, 220, 255)"
                    className="bi bi-thermometer-half"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415z"
                    />
                    <path
                      d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z"
                    />
                  </SvgIcon>
                  <span className="weather-data"></span>&#176;<span className="temperature-unit"></span>
                </span>
                &nbsp;-&nbsp;
                <span className="humidity">
                  <SvgIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
                    fill="rgb(200, 220, 255)"
                    className="bi bi-droplet-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6zM6.646 4.646c-.376.377-1.272 1.489-2.093 3.13l.894.448c.78-1.559 1.616-2.58 1.907-2.87l-.708-.708z"
                    />
                  </SvgIcon>
                  <span className="weather-data"></span>%
                </span>
                <br />
              </Typography>
              <Typography variant="h6" className="heat-index-wrapper" style={{ marginBottom: 0 }}>
                <b>
                  Heat Index:
                  <span className="heat-index"></span>&#176;<span className="temperature-unit"></span>
                  <span className="heat-index-category"></span>
                </b>
              </Typography>
            </Grid>
          </div>

          <div id="health-suggestions-wrapper" className="row">
            <List id="health-suggestions">
              {/* You can map your health suggestions here */}
              {/* Example:
              <ListItem>
                <ListItemText primary="Suggestion 1" />
              </ListItem>
              */}
            </List>
          </div>
        </Container>
      </Grid>

      <Grid item id="right-wrapper" xs={6}>
        <Container>
          <Typography variant="h3" className="text-center mb-0" style={{ paddingTop: '5vh' }}>
            SCAN FOR HISTORICAL DATA
          </Typography>

          <div id="qr-wrapper" className="row d-flex justify-content-center align-items-center">
            <div id="qr-code" className="col-2 p-0">
              {/* You can add QR code rendering here */}
            </div>
          </div>
        </Container>

        <div id="historical-graph-wrapper">
          {/* You can add the historical graph here */}
        </div>
      </Grid>
    </Grid>
  );
};

export default Screen;
