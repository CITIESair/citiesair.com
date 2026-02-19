import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, useTheme } from '@mui/material';
import * as Tracking from '../../Utils/Tracking';
import { CITIESair } from '../../Utils/GlobalVariables';

const CITIESlogoLinkToHome: React.FC = () => {
  const theme = useTheme();

  return (
    <Tooltip title="Home">
      <Link
        to="/"
        onClick={() => {
          Tracking.sendEventAnalytics(Tracking.Events.internalNavigation, {
            destination_id: '/',
            destination_label: 'home',
            origin_id: 'cities-logo',
          });
        }}
      >
        <img
          style={{
            height: '100%',
            width: 'auto',
            borderRadius: theme.shape.borderRadius,
          }}
          src="/images/cities-logo.png"
          title={`${CITIESair} Logo`}
          alt={`${CITIESair} Logo`}
        />
      </Link>
    </Tooltip>
  );
};

export default CITIESlogoLinkToHome;
