import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import * as Tracking from '../../Utils/Tracking';
import citiesLogo from '../../cities-logo.png';

function CITIESlogoLinkToHome() {
  return (
    <Tooltip title="Home">
      <Link
        to="/"
        onClick={() => {
          Tracking.sendEventAnalytics(
            Tracking.Events.internalNavigation,
            {
              destination_id: '/',
              destination_label: 'home',
              origin_id: 'cities-logo'
            }
          );
        }}
      >
        <img
          style={{
            height: '100%', width: 'auto', borderRadius: '0.5rem'
          }}
          src={citiesLogo}
          title="CITIESair Logo"
          alt="CITIESair Logo"
        />
      </Link>
    </Tooltip>
  );
}

export default CITIESlogoLinkToHome;
