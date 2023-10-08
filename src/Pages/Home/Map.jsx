// disable eslint for this file
/* eslint-disable */

import { Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function MapPlaceholder() {
    return (
        <p>
            Map of CITIESair stations in Abu Dhabi
            <noscript>You need to enable JavaScript to see this map.</noscript>
        </p>
    )
}

const Map = ({ themePreference }) => {
    const tileUrl = `https://{s}.tile.jawg.io/jawg-${themePreference ? themePreference.toLowerCase() : 'light'}/{z}/{x}/{y}{r}.png?access-token={accessToken}`;

    console.log(tileUrl)

    const tileAttribution = '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors';

    const tileAccessToken = 'N4ppJQTC3M3uFOAsXTbVu6456x1MQnQTYityzGPvAkVB3pS27NMwJ4b3AfebMfjY';

    const centerCoordinate = [24.4132075, 54.5181108];

    return (
        <Box height="50vh" sx={{
            '& .leaflet-container': { height: "100%", width: "100%" },
            '& .leaflet-control-attribution': { fontSize: '0.5rem' }
        }}>
            <MapContainer
                center={centerCoordinate}
                zoom={10}
                scrollWheelZoom={false}
                placeholder={<MapPlaceholder />}
            >
                <TileLayer
                    attribution={tileAttribution}
                    url={tileUrl}
                    minZoom={8}
                    maxZoom={12}
                    accessToken={tileAccessToken}
                />
                <Marker position={[24.4132075, 54.5181108]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </Box>
    )
}

export default Map;