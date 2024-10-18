import { useState } from 'react';
import { Box, Tab, Typography, useMediaQuery } from '@mui/material';

import StyledTabs from '../../StyledTabs';
import AlertsTable from './AlertsTable';

import { getAlertPlaceholder, useAirQualityAlert } from '../../../ContextProviders/AirQualityAlertContext';
import AlertTypes from './AlertTypes';
import { isValidArray } from '../../../Utils/UtilFunctions';

function AlertTab(props) {
  const { children, value, index, alertType, alertsArray, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`alert-tabpanel-${alertType.id}`}
      aria-labelledby={`alert-tab-${alertType.id}`}
      width="100%"
      {...other}
    >
      <AlertsTable
        alertTypeKey={alertType.id}
        alertsForTable={alertsArray}
      />

      {
        alertType.disclaimer ? (
          <Typography
            display="block"
            variant="caption"
            textAlign="right"
            width="100%"
            fontStyle="italic"
            my={1}
          >
            {alertType.disclaimer}
          </Typography>
        ) : null
      }

    </Box>
  );
}

export default function AlertsTabs() {
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);

  const { setSelectedAlert } = useAirQualityAlert();

  const handleTabChange = (_, newVal) => {
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
      else return null;
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
            alertType={type}
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
