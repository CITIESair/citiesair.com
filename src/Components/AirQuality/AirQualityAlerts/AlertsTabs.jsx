import { useState } from 'react';
import { Box, Tab, useMediaQuery } from '@mui/material';

import StyledTabs from '../../StyledTabs';
import AlertsTable from './AlertsTable';

import { useAirQualityAlert } from '../../../ContextProviders/AirQualityAlertContext';
import AlertTypes from './AlertTypes';

function AlertTab(props) {
  const { children, value, index, alertTypeKey, ...other } = props;

  const { alerts } = useAirQualityAlert();

  const filteredAlertsBasedOnAlertType = alerts.filter((alert) => {
    const alertType = alert?.alert_type?.toLowerCase();
    if (alertType.includes(alertTypeKey)) return alert;
  });

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`alert-tabpanel-${alertTypeKey}`}
      aria-labelledby={`alert-tab-${alertTypeKey}`}
      width="100%"
      {...other}
    >
      <AlertsTable
        alertTypeKey={alertTypeKey}
        alertsForTable={filteredAlertsBasedOnAlertType} />
    </Box>
  );
}

export default function AlertsTabs(props) {
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newVal) => {
    setCurrentTab(newVal);
  };

  return (
    <Box>
      <StyledTabs
        value={currentTab}
        onChange={handleTabChange}
        variant={smallScreen ? 'fullWidth' : 'standard'}
        smallFontSize="0.825rem"
      >
        {Object.values(AlertTypes).map((type) => (
          <Tab
            key={type.id}
            value={type.index}
            icon={type.icon}
            label={type.name}
            iconPosition="start"
            sx={{ py: 0 }}
          />
        ))}
      </StyledTabs>

      {Object.values(AlertTypes).map((type) => (
        <AlertTab
          key={type.id}
          alertTypeKey={type.id}
          value={currentTab}
          index={type.index}
        />
      ))}
    </Box>
  );
}
