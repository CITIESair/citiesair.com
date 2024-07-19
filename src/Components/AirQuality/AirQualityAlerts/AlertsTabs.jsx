import { useState } from 'react';
import { Box, Tab, useMediaQuery } from '@mui/material';

import StyledTabs from '../../StyledTabs';
import AlertsTable from './AlertsTable';

import { alertPlaceholder, getAlertPlaceholder, useAirQualityAlert } from '../../../ContextProviders/AirQualityAlertContext';
import AlertTypes from './AlertTypes';
import { isValidArray } from '../../../Utils/UtilFunctions';

function AlertTab(props) {
  const { children, value, index, alertTypeKey, alertsArray, ...other } = props;

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
        alertsForTable={alertsArray} />
    </Box>
  );
}

export default function AlertsTabs(props) {
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);

  const { setSelectedAlert } = useAirQualityAlert();

  const handleTabChange = (event, newVal) => {
    setCurrentTab(newVal);
    setSelectedAlert(
      getAlertPlaceholder(AlertTypes[Object.keys(AlertTypes)?.[newVal]]?.id)
    );
  };

  const { alerts } = useAirQualityAlert();

  const returnFilteredAlertsBasedOnAlertType = (alertTypeKey) => {
    const filteredAlerts = alerts.filter((alert) => {
      const alertType = alert?.alert_type?.toLowerCase();
      if (alertType.includes(alertTypeKey)) return alert;
    });

    const alertsLength = isValidArray(filteredAlerts) ? filteredAlerts.length : "0";

    return {
      array: filteredAlerts,
      alertsLength
    }
  }

  return (
    <Box>
      <StyledTabs
        value={currentTab}
        onChange={handleTabChange}
        variant={smallScreen ? 'fullWidth' : 'standard'}
        smallFontSize="0.825rem"
      >
        {Object.values(AlertTypes).map((type) => {
          const filteredAlerts = returnFilteredAlertsBasedOnAlertType(type.id);
          return (
            <Tab
              key={type.id}
              value={type.index}
              icon={type.icon}
              label={`${type.name} (${filteredAlerts?.alertsLength})`}
              iconPosition="start"
              sx={{ py: 0 }}
            />
          )
        }
        )}
      </StyledTabs>

      {Object.values(AlertTypes).map((type) => {
        const filteredAlerts = returnFilteredAlertsBasedOnAlertType(type.id);
        return (
          <AlertTab
            key={type.id}
            alertTypeKey={type.id}
            value={currentTab}
            index={type.index}
            alertsArray={filteredAlerts.array}
          />
        )
      }
      )}
    </Box>
  );
}
